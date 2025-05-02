import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateColaboradorDto {
  
  @IsEmail()
  @IsNotEmpty()
  destinatarioEmail: string;

}