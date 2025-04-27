
import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, Column } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Task } from 'src/tasks/entities/task.entity';
import { TaskRole } from 'src/auth/strategy/task-roles';

@Entity()
export class UserTask {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(
    () => User, 
    user => user.userTasks)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(
    () => Task,
     task => task.userTasks)
  @JoinColumn({ name: 'task_id' })
  task: Task;

  @Column({
    type: 'enum',
    enum: TaskRole,
    default: TaskRole.COLABORADOR
  })
  role: TaskRole;

  @Column({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP'
  })
  assignedAt: Date;
}