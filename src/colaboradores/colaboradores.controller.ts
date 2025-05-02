import { Controller, Get, Post, Body, Patch, Param, Delete, Req, ParseIntPipe, ParseUUIDPipe } from '@nestjs/common';
import { ColaboradoresService } from './colaboradores.service';
import { CreateColaboradorDto } from './dto/create-colaborador.dto';
import { UpdateColaboradorDto } from './dto/update-colaborador.dto';
import { GetUser } from 'src/auth/decorators/get-user.decorator';
import { User } from 'src/auth/entities/user.entity';
import { Auth } from 'src/auth/decorators/auth.decorator';

@Controller('colaboradores')
export class ColaboradoresController {
  constructor(private readonly colaboradoresService: ColaboradoresService) {}

  @Post('enviar')
  @Auth('usuario')
  async enviar(
    @GetUser() user: User, 
    @Body() createColaboradorDto: CreateColaboradorDto
  ) {
    return this.colaboradoresService.enviarSolicitudPorEmail(user.id, createColaboradorDto.destinatarioEmail);
  }

  @Auth('usuario')
  @Patch('aceptar/:id')
  async aceptarSolicitud(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: User
  ) { // Asegúrate de que tu estrategia de autenticación lo incluya
    return this.colaboradoresService.aceptarSolicitud(id, user);
  }
 

  @Auth('usuario')
  @Get('pendientes')
  async verSolicitudesPendientes(@GetUser() user: User) {
    const userId = user.id;
    return this.colaboradoresService.obtenerSolicitudesPendientes(userId);
  }

  
@Auth('usuario')
@Patch('rechazar/:id')
  async rechazarSolicitud(
    @Param('id', ParseUUIDPipe) id: string,
    @GetUser() user: User
  ) {
    return this.colaboradoresService.rechazarSolicitud(id, user);
  }


  @Get('get-colaborador')
  @Auth('usuario')
  listarColaboradores(@GetUser() user: User){
    return this.colaboradoresService.getColaboradores(user)
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.colaboradoresService.remove(+id);
  // }
}
