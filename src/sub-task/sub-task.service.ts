import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateSubTaskDto } from './dto/create-sub-task.dto';
import { UpdateSubTaskDto } from './dto/update-sub-task.dto';
import { User } from 'src/auth/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Estados } from 'src/estados/entities/estados.entity';
import { In, Repository } from 'typeorm';
import { Subtask } from './entities/sub-task.entity';
import { Task } from 'src/tasks/entities/task.entity';

@Injectable()
export class SubTaskService {

  constructor(

    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,

    @InjectRepository(Subtask)
    private readonly subTaskRepository: Repository<Subtask>,

    @InjectRepository(Estados)
    private readonly estadosRepository: Repository<Estados>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ){

  }

  async createSubTask(createSubTaskDto: CreateSubTaskDto, taskId: string) {

    const task = await this.taskRepository.findOne({where: {id: taskId } })

    if(!task)
      throw new NotFoundException('Task no encontrado o creado aún!!')

    const {titulo, descripcion} =  createSubTaskDto;

    const estadoInicial = await this.estadosRepository.findOne({
      where: {nombre: 'creado'}
    });

    if(!estadoInicial)
      throw new NotFoundException('Estado no encontrado');

    const asignados = await this.validarYObtenerUsers(createSubTaskDto.asignados);
    

    const nuevoSubTask =  await this.subTaskRepository.create({
      titulo,
      descripcion,
      task,
      estados: estadoInicial,
      asignados
    })

    const subTaskNuevo = await this.subTaskRepository.save( nuevoSubTask );


    return subTaskNuevo;
  }

  async update(id: string, updateSubTaskDto: UpdateSubTaskDto) {

    const subtask = await this.subTaskRepository.findOne({
      where: { id },
      relations: ['estados', 'task', 'asignados'],
    });
  
    if (!subtask) {
      throw new NotFoundException(`Subtarea con id ${id} no encontrada`);
    }
  
    // Actualizar campos simples
    if (updateSubTaskDto.titulo !== undefined) subtask.titulo = updateSubTaskDto.titulo;
    if (updateSubTaskDto.descripcion !== undefined) subtask.descripcion = updateSubTaskDto.descripcion;
    if (updateSubTaskDto.completedAt !== undefined) subtask.completedAt = updateSubTaskDto.completedAt;
  
    // Actualizar estado (relación)
    if (updateSubTaskDto.id_estado) {
      const estado = await this.estadosRepository.findOneBy({ id: updateSubTaskDto.id_estado });
      if (!estado) {
        throw new NotFoundException(`Estado con id ${updateSubTaskDto.id_estado} no encontrado`);
      }
      subtask.estados = estado;
    }
  
    // // Actualizar tarea padre (relación)
    // if (updateSubTaskDto.taskId) {
    //   const task = await this.taskRepository.findOneBy({ id: updateSubTaskDto.taskId });
    //   if (!task) {
    //     throw new NotFoundException(`Tarea con id ${updateSubTaskDto.taskId} no encontrada`);
    //   }
    //   subtask.task = task;
    // }
  
    // Actualizar asignados (relación muchos a muchos)
    if (updateSubTaskDto.asignados) {
      subtask.asignados = await this.validarYObtenerUsers(updateSubTaskDto.asignados);
    }
  
    return this.subTaskRepository.save(subtask);
  }


  
  remove(id: number) {
    return `This action removes a #${id} subTask`;
  }

  private async validarYObtenerUsers( userIds?: string[] ): Promise<User[]> {

    if (!userIds || userIds.length === 0) return [];

    const users = await this.userRepository.findBy({ 
      id: In([...userIds]) // Spread operator para conversión segura
    });

    if (users.length !== userIds.length) {

      const idDesaparecido = userIds.filter(id => !users.some(u => u.id === id));

      throw new NotFoundException(`Usuarios no encontrados: ${idDesaparecido.join(', ')}`);
    }

    return users;
  }
  
}
