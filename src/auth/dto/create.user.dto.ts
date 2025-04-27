import { Exclude } from "class-transformer";
import { IsEmail, IsInt, IsString, IsStrongPassword, MinLength } from "class-validator";


export class CreateUserDto{
    
    @IsString()
    @MinLength(1)
    nombre:string;

    @IsString()
    @IsEmail()
    email: string;

    @IsStrongPassword({
        minLength: 6,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 0,
      })
    password: string;

    
    @IsStrongPassword({
      minLength: 6,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 0,
    })
    confirmPassword: string;

    @IsInt()
    id_genero: number;
}