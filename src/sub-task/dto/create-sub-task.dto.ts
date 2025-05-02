import { IsArray, IsNotEmpty, IsOptional, IsString, IsUUID, MinLength } from "class-validator";

export class CreateSubTaskDto {

    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    titulo: string;

    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    descripcion: string;
      
    @IsArray()
    @IsUUID(4, { each: true })
    @IsOptional()
    asignados?: string[];
    
      
}
