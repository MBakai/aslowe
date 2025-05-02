import { PartialType } from '@nestjs/mapped-types';
import { CreateSubTaskDto } from './create-sub-task.dto';
import { IsArray, IsDate, IsInt, IsOptional, IsString, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateSubTaskDto extends PartialType(CreateSubTaskDto) {

    @IsOptional()
    @IsString()
    titulo?: string;
  
    @IsOptional()
    @IsString()
    descripcion?: string;
  
    @IsOptional()
    id_estado?: number; // si estás actualizando el estado por su id
  
    @IsOptional()
    @IsArray()
    @IsUUID("all", { each: true })
    asignados?: string[]; // lista de IDs de usuarios asignados
  
    @IsOptional()
    @Type(() => Date)
    @IsDate()
    completedAt?: Date;
}
