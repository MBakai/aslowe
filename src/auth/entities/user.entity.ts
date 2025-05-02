import { Entity, PrimaryGeneratedColumn, Column, Unique, ManyToOne, JoinColumn, BeforeInsert, BeforeUpdate, OneToMany, ManyToMany, JoinTable } from 'typeorm';

import { Task } from 'src/tasks/entities/task.entity';
import { Genero } from 'src/genero/entities/genero.entitys';
import { Roles } from 'src/roles/entities/roles.entity';
import { Colaborador } from 'src/colaboradores/entities/colaborador.entity';
import { Subtask } from 'src/sub-task/entities/sub-task.entity';

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

  @Column('bool',{
    default: true
  })
  activo: boolean;

  @ManyToOne(
    () => Genero,
    genero  => genero.users)
  @JoinColumn({ name: 'id_genero' })
  genero: Genero;

  @ManyToOne(
    () => Roles,
    role => role.users,
    { eager: true }
  )
  @JoinColumn({ name: 'role_id' }) 
  role: Roles;

  // Tareas creadas por el usuario  
  @OneToMany(
    () => Task,
    (task) => task.creador)
  crearTasks: Task[];

  @ManyToMany(
    () => Subtask,
    subtask => subtask.asignados
  )
  subtasksAsignadas: Subtask[];

  @OneToMany(
    () => Colaborador,
     (amistad) => amistad.solicitante)
  sentCollabRequests: Colaborador[];

  @OneToMany(
    () => Colaborador,
     (amistad) => amistad.destinatario)
  receivedCollabRequests: Colaborador[];



  @BeforeInsert()
  CheckFieldBeforeInsert(){
    this.email = this.email.toLowerCase().trim();
  }

  @BeforeUpdate()
  CheckFieldBeforeUpdate(){
    this.CheckFieldBeforeInsert();
  }

}