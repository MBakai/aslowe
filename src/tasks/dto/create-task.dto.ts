import { Type } from "class-transformer";
import { IsArray, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, MinLength, ValidateNested } from "class-validator";
import { TaskRole } from "src/auth/strategy";
  
export class CollaboratorDto {

  @IsUUID('4')
  userId: string;

  @IsOptional()
  @IsString()
  role?: TaskRole;
}

  export class CreateTaskDto {

    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    titulo: string;
  
    @IsString()
    @IsNotEmpty()
    @MinLength(1)
    descripcion: string;
  
    @IsInt()
    id_estado: number;
  
    @IsUUID('4')
    @IsOptional()
    user_id?: string;

    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true }) // Para validar cada elemento del array
    @Type(() => CollaboratorDto) // Para transformar correctamente
    collaborators?: CollaboratorDto[]; // Usamos la clase definida // Rol opcional, por defecto será 'colaborador'
    
  }