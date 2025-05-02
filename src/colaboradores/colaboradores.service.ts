import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { Colaborador } from './entities/colaborador.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/auth/entities/user.entity';
import { ColaboradorDto } from './dto/colaborador.dto';

@Injectable()
export class ColaboradoresService {

  constructor(
    @InjectRepository(Colaborador)
    private readonly colaboradorRepository: Repository<Colaborador>,

    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ){}
  

  // ════════════════════════════════════════════════
  // 🧪 FUNC: Enviar solicitudes de amigo
  // ════════════════════════════════════════════════
  async enviarSolicitudPorEmail(solicitanteId: string, destinatarioEmail: string): Promise<Colaborador> {
    if (!destinatarioEmail) {
      throw new BadRequestException('Se requiere el email del destinatario');
    }
  
    const destinatario = await this.userRepository.findOneBy({ email: destinatarioEmail.toLowerCase().trim() });
  
    if (!destinatario) {
      throw new NotFoundException('El destinatario no existe');
    }
  
    if (destinatario.id === solicitanteId) {
      throw new BadRequestException('No puedes enviarte solicitud a ti mismo');
    }
  
    const yaExiste = await this.colaboradorRepository.findOne({
      where: [
        { solicitante: { id: solicitanteId }, destinatario: { id: destinatario.id } },
        { solicitante: { id: destinatario.id }, destinatario: { id: solicitanteId } }
      ]
    });
  
    if (yaExiste) {
      throw new ConflictException('Ya existe una solicitud entre estos usuarios');
    }
  
    const solicitud = this.colaboradorRepository.create({
      solicitante: { id: solicitanteId },
      destinatario: { id: destinatario.id },
      status: 'pendiente'
    });
  
    return this.colaboradorRepository.save(solicitud);
  }


  // ════════════════════════════════════════════════
  // 🧪 FUNC: aceptar solicitudes
  // ════════════════════════════════════════════════
  async aceptarSolicitud(idSolicitud: string, user: User) {

    // 1. Buscar la solicitud con relaciones necesarias
    const solicitud = await this.colaboradorRepository.findOne({

      where: { id: idSolicitud },
      relations: ['destinatario'], // Solo cargamos la relación necesaria
    });

    // 2. Validaciones
    if (!solicitud) {
      throw new NotFoundException('Solicitud de colaboración no encontrada');
    }

    if (solicitud.destinatario.id !== user.id) {
      throw new ForbiddenException('No eres el destinatario de esta solicitud');
    }

    if (solicitud.status !== 'pendiente') {
      throw new BadRequestException(`La solicitud ya fue ${solicitud.status}`);
    }

    // 3. Actualización
    solicitud.status = 'aceptada';
    solicitud.updateAt = new Date(); // Actualizamos automáticamente

    // 4. Guardar cambios
    try {
      await this.colaboradorRepository.save(solicitud);

    } catch (error) {
      throw new BadRequestException('Error al actualizar la solicitud');
    }
  }
  

  // ════════════════════════════════════════════════
  // 🧪 FUNC: ver o obtener todas las solicitudes
  // ════════════════════════════════════════════════
  async obtenerSolicitudesPendientes(userId: string): Promise<Colaborador[]> {

      return this.colaboradorRepository.find({

      where: [
        { destinatario: { id: userId }, status: 'pendiente' },
        { solicitante: { id: userId }, status: 'pendiente' }
      ],

      relations: ['solicitante', 'destinatario'],
      order: { createdAt: 'DESC' }

    });
  }


  // ════════════════════════════════════════════════
  // 🧪 FUNC: rechazar solicitud
  // ════════════════════════════════════════════════
  async rechazarSolicitud(idSolicitud: string, user: User) {

    // 1. Buscar la solicitud con relaciones necesarias
    const solicitud = await this.colaboradorRepository.findOne({

      where: { id: idSolicitud },
      relations: ['destinatario'], // Solo cargamos la relación necesaria
    });

    // 2. Validaciones
    if (!solicitud) {
      throw new NotFoundException('Solicitud de colaboración no encontrada');
    }

    if (solicitud.destinatario.id !== user.id) {
      throw new ForbiddenException('No eres el destinatario de esta solicitud');
    }

    if (solicitud.status !== 'pendiente') {
      throw new BadRequestException(`La solicitud ya fue ${solicitud.status}`);
    }

    // 3. Actualización
    solicitud.status = 'rechazada';
    solicitud.updateAt = new Date(); // Actualizamos automáticamente

    // 4. Guardar cambios
    try {
      await this.colaboradorRepository.save(solicitud);

    } catch (error) {
      throw new BadRequestException('Error al actualizar la solicitud');
    }
  }

  async getColaboradores(user: User): Promise<ColaboradorDto[]> {
    
    const colaboraciones = await this.colaboradorRepository.find({
      where: [
        { solicitante: { id: user.id }, status: 'aceptada' },
        { destinatario: { id: user.id }, status: 'aceptada' }
      ],
      relations: ['solicitante', 'destinatario']
    });

    return colaboraciones.map(colab => {
      const colaborador = colab.solicitante.id === user.id 
        ? colab.destinatario 
        : colab.solicitante;
      
      return {
        id: colaborador.id,
        nombre: colaborador.nombre,
        email: colaborador.email
      };
    });
  }
}
