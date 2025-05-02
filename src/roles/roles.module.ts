import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Roles } from './entities/roles.entity';
import { RolesService } from './roles.service';
import { RolesController } from './roles.controller';
import { Colaborador } from 'src/colaboradores/entities/colaborador.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ Roles ])
  ],
  controllers: [RolesController],
  providers: [RolesService],
  exports:[ TypeOrmModule, RolesService, ]
})
export class RolesModule {}
