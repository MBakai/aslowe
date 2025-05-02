import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { AuthModule } from 'src/auth/auth.module';
import { EstadosModule } from 'src/estados/estados.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { User } from 'src/auth/entities/user.entity';
import { Roles } from 'src/roles/entities/roles.entity';
import { Subtask } from 'src/sub-task/entities/sub-task.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, Subtask, User, Roles]),
    EstadosModule, AuthModule
  ],
  controllers: [
    TasksController

  ],
  providers: [
    TasksService
  ],
})
export class TasksModule {}
