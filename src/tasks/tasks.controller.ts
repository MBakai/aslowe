import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { User } from 'src/auth/entities/user.entity';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { GetUser } from 'src/auth/decorators/get-user.decorator';

@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post('create-task')
  @Auth('usuario')
  create(@Body() createTaskDto: CreateTaskDto,
        @GetUser() user: User) {
    return this.tasksService.createTask(createTaskDto, user);
  }

  @Get('listarTasks')
  @Auth('usuario')
  getTaskUser( @GetUser() user: User){
    return this.tasksService.listarTaskUser(user)  
  }


}
