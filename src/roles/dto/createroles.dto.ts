import { IsString, MinLength } from "class-validator";

export class CreateRolesDto {

    @IsString()
    rolNombre: string;

}
