import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TasksController } from './tasks.controller';
import { AuthModule } from 'src/auth/auth.module';
import { EstadosModule } from 'src/estados/estados.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { UserTask } from 'src/user-task/user-task.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Task, UserTask]),
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
