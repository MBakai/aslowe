import { PartialType } from '@nestjs/mapped-types';
import { CreateTaskDto } from './create-task.dto';
import { IsInt } from 'class-validator';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {

    @IsInt()
    id_estado: number;
}
