import { Module } from '@nestjs/common';
import { GeneroService } from './genero.service';
import { GeneroController } from './genero.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Genero } from './entities/genero.entitys';

@Module({
  imports:[
    TypeOrmModule.forFeature([Genero])
  ],
  controllers: [
    GeneroController
  ],
  providers: [
    GeneroService
  ],
  exports:[
    GeneroService, TypeOrmModule
  ],
})
export class GeneroModule {}
