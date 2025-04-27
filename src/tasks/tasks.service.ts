import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateTaskDto } from './dto/create-task.dto';
import { Estados } from 'src/estados/entities/estados.entity';
import { Task } from './entities/task.entity';
import { UserTask } from 'src/user-task/user-task.entity';
import { User } from 'src/auth/entities/user.entity';
import { TaskRole } from 'src/auth/strategy';

@Injectable()
export class TasksService {

  constructor(

    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,

    @InjectRepository(UserTask)
    private readonly userTaskRepository: Repository<UserTask>,

    @InjectRepository(Estados)
    private readonly estadoRepository: Repository<Estados>
  ){

  }


  // ════════════════════════════════════════════════
  // 🧪 FUNC: Crea una tarea solo cuando el usuario tenga un token valido
  // ════════════════════════════════════════════════
  async create(createTaskDto: CreateTaskDto, user: User) {
    try {
      const { titulo, descripcion } = createTaskDto;
      
      const estados = await this.estadoRepository.findOneBy({
        id: createTaskDto.id_estado 
      });
  
      if (!estados)
        throw new NotFoundException('Estado no encontrado');
  
      const nuevoTask = this.taskRepository.create({
        titulo,
        descripcion,
        estados,
        creador: user,
      });
  
      const taskGuardado = await this.taskRepository.save(nuevoTask);
  
      const crearRol = this.userTaskRepository.create({
        user,
        task: taskGuardado,
        role: TaskRole.CREADOR,
      });
  
      await this.userTaskRepository.save(crearRol);
  
      if (createTaskDto.collaborators && createTaskDto.collaborators.length > 0) {
        const collaborators = createTaskDto.collaborators.map(collaborator => ({
          user: { id: collaborator.userId },
          task: taskGuardado,
          role: collaborator.role || TaskRole.COLABORADOR,
        }));
  
        await this.userTaskRepository.save(collaborators);
      }
  
      return taskGuardado;
  
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new InternalServerErrorException('Error al crear la tarea');
    }
  }

  async getTasksAll(user: User) {
    try {
      // Buscar las tareas asociadas al usuario a través de la tabla UserTask
      const userTasks = await this.userTaskRepository.find({
        where: {
          user: user,
        },
        relations: [
          'task',
          'task.creador',
          'task.userTasks',
          'task.userTasks.user', 
          'task.estados',
          'user', 
        ],
      });

      console.log({userTasks});
      
  
      // Si no se encontraron tareas para este usuario
      if (!userTasks || userTasks.length === 0) {
        
        throw new NotFoundException('No se encontraron tareas para este usuario');
      }
  
      // Extraer solo las tareas de los registros encontrado s
      const tasks = userTasks.map(userTask => {
        const task = userTask.task;
  
        // Extraer los colaboradores (excluir al creador de la tarea)
        const collaborators = task.userTasks
          .filter(userTask => userTask.user.id !== user.id) // Excluir al creador
          .map(userTask => ({
            userId: userTask.user.id,
            nombre: userTask.user.nombre,
            role: userTask.role,
          }));
  
        // Formatear la tarea con la información extraída
        return {
          id: task.id,
          titulo: task.titulo,
          descripcion: task.descripcion,
          estado: task.estados.nombre, // Nombre del estado
          creador: task.creador.nombre, // Nombre del creador
          collaborators: collaborators, // Lista de colaboradores
        };
      });
  
      return tasks;

    } catch (error) {

      throw new InternalServerErrorException('Error al obtener las tareas');
    }
  }
  // async findAll(paginationDto: PaginationDto) {

  //   const {limit= 10, offset = 0} = paginationDto; 

  //   const product = await this.productRepository.find({
  //     take:limit,
  //     skip: offset,
  //     relations: {
  //       images: true
  //     }

  //   });

  //   return product.map( ( product ) => ({
  //     ...product,
  //     imaages: product.images?.map( img => img.url )
  //   }));
  // }
}
