import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Roles } from './entities/roles.entity';

@Injectable()
export class RolesService {

  constructor(
    @InjectRepository(Roles)
    private readonly RoleRepository: Repository<Roles>
  ){}


  async onApplicationBootstrap() {
    const rolNombrePorDefecto = [ 'admin', 'usuario'];
    
    for (const rolNombre of rolNombrePorDefecto) {
      const rolNombreExiste = await this.RoleRepository.findOneBy( { rolNombre } );
      if (!rolNombreExiste) {
        
        const nuevo = this.RoleRepository.create({ rolNombre });
        await this.RoleRepository.save(nuevo);
      }
    }
  }
 
}
