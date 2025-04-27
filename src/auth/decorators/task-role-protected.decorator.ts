import { SetMetadata } from '@nestjs/common';
import { TaskRole } from '../strategy';

export const META_ROLES = 'taskRoles';
 
export const TaskRoleProtected = (...roles: TaskRole[] ) => {

    return SetMetadata('META_ROLES', roles);

}
