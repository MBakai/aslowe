import { Module } from '@nestjs/common';
import { EstadosService } from './estados.service';
import { EstadosController } from './estados.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Estados } from './entities/estados.entity';

@Module({
  imports:[
    TypeOrmModule.forFeature([Estados])
  ],
  controllers: [
    EstadosController
  ],
  providers: [
    EstadosService
  ],
  exports: [
    EstadosService, TypeOrmModule
  ]
})
export class EstadosModule {}
