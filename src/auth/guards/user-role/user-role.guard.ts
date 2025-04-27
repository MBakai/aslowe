import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Observable } from 'rxjs';
import { META_ROLES } from 'src/auth/decorators/task-role-protected.decorator';
import { User } from 'src/auth/entities/user.entity';
import { UserTask } from 'src/user-task/user-task.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserRoleGuard implements CanActivate {

  constructor(
    private readonly reflector: Reflector,

    @InjectRepository(UserTask)
    private readonly userTaskRepository: Repository<UserTask>

  ){}

 async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    
    const taskRole: string[] = this.reflector.get(META_ROLES, context.getHandler());

    //Si no hay ningun rol definido, permite el acceso
    if( !taskRole || taskRole.length === 0  ) return true;
    
    const req = context.switchToHttp().getRequest();

    const user = req.user as User;

    if( !user )
      throw new BadRequestException('Usuaro no encontrado!!');

    // Obtener los roles del usuario desde la tabla userTask
    const userTasks = await this.userTaskRepository.find({ 
      where: { user: { id: user.id } },
      select: ['role'] // solo el campo role
    });

    // Verificar si el usuario tiene al menos uno de los roles requeridos
    const hasRequiredRole = userTasks.some(userRole => 
      taskRole.includes(userRole.role)
    );

    if(!hasRequiredRole) {
      throw new ForbiddenException(
        `El usuario ${user.nombre} no tiene los roles necesarios. ` +
        `Roles requeridos: [${taskRole.join(', ')}]`
      );
    }

    return true;
  }
}
