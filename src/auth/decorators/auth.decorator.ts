import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TaskRoleProtected } from './task-role-protected.decorator';
import { UserRoleGuard } from '../guards/user-role/user-role.guard';
import { TaskRole } from '../strategy';

export function Auth(...roles: TaskRole[]) {
    
  return applyDecorators(
    TaskRoleProtected( ...roles),
    UseGuards( AuthGuard('jwt'), UserRoleGuard ),
  );
}