import { BadRequestException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateTaskDto } from './dto/create-task.dto';
import { Estados } from 'src/estados/entities/estados.entity';
import { Task } from './entities/task.entity';
import { User } from 'src/auth/entities/user.entity';
import { Roles } from 'src/roles/entities/roles.entity';
@Injectable()
export class TasksService {

  constructor(

    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    @InjectRepository(Estados)
    private readonly estadoRepository: Repository<Estados>
  ){

  }


  // ════════════════════════════════════════════════
  // 🧪 FUNC: Crea una tarea solo cuando el usuario tenga un token valido
  // ════════════════════════════════════════════════
  async createTask(createTaskDto: CreateTaskDto, user: User){



    const {titulo, descripcion} = createTaskDto;

    const estadoInicial = await this.estadoRepository.findOne({
      where: {nombre: 'creado'}
    });

    if(!estadoInicial)
      throw new NotFoundException('El estado no se encuentra!!')

    const taskCreado = await this.taskRepository.create({
      titulo,
      descripcion,
      estados: estadoInicial,
      creador: user
    });

    const nuevoTask = await this.taskRepository.save(taskCreado);

    return {
      message: 'Task creada exitosamente',
        task: nuevoTask
    }


  }


  async listarTaskUser( user:User ){
    try {

      const listaTask = await this.taskRepository.find({
        where: { creador: { id: user.id }},
        relations:[
          'subtasks',
          'subtasks.estados',
          'subtasks.asignados',] // de esta manera puedo traer la informacion de user con sub-task
      });

      if(listaTask.length === 0){
        throw new NotFoundException('No se han encontrado tareas creadas para este usuario!!');
      
      }else{
        return listaTask;
        
      }

    } catch (error) {
      if (error instanceof HttpException) {
        throw error; // vuelve a lanzar la excepción original (como NotFound)
      }
  
      throw new BadRequestException('Error al listar tareas: ' + error.message);
    } 


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

