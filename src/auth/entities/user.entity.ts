import { Entity, PrimaryGeneratedColumn, Column, Unique, ManyToOne, JoinColumn, BeforeInsert, BeforeUpdate, OneToMany, ManyToMany } from 'typeorm';

import { Task } from 'src/tasks/entities/task.entity';
import { Genero } from 'src/genero/entities/genero.entitys';
import { UserTask } from 'src/user-task/user-task.entity';

@Entity('user')
@Unique(['email'])
export class User {
    
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  nombre: string;

  @Column('text')
  email: string;
  
  @Column('text',{
    select: false
  })
  password: string;

  @ManyToOne(
    () => Genero,
    genero  => genero.users)
  @JoinColumn({ name: 'id_genero' })
  genero: Genero;

  // Tareas creadas por el usuario 
  @OneToMany(
    () => Task,
    (task) => task.creador)
  crearTasks: Task[];

  
  @OneToMany(
    () => UserTask,
    (userTask) => userTask.user)
  userTasks: UserTask[];


  @BeforeInsert()
  CheckFieldBeforeInsert(){
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  CheckFieldBeforeUpdate(){
    this.CheckFieldBeforeInsert();
  }

}