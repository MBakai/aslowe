import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column, ManyToMany, JoinTable, CreateDateColumn, UpdateDateColumn } from 'typeorm';

import { User } from 'src/auth/entities/user.entity';
import { Estados } from 'src/estados/entities/estados.entity';
import { Task } from 'src/tasks/entities/task.entity';


@Entity('subTask')
export class Subtask {
  @PrimaryGeneratedColumn('uuid')
  id: string; 

  @Column()
  titulo: string;

  @Column({ nullable: true })
  descripcion: string;

  @ManyToOne(() => Estados)
  @JoinColumn({ name: 'id_estado' })
  estados: Estados;

  @ManyToOne(
    () => Task,
     task => task.subtasks)   
  task: Task;

  @ManyToMany(() => User)
  @JoinTable({
      name: 'subtask_asignados',
      joinColumn: {
          name: 'subtask_id',
          referencedColumnName: 'id',
      },
      inverseJoinColumn: {
          name: 'user_id',
          referencedColumnName: 'id',
      },
  })
  asignados: User[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ nullable: true })
  completedAt: Date;
}