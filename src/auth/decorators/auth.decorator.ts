import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRoleGuard } from '../guards/user-role/user-role.guard';
import { RolesProtected } from './roles-protected.decorator';

export function Auth(...role: string[]) {
    
  return applyDecorators(
    RolesProtected( ...role),
    UseGuards( AuthGuard('jwt'), UserRoleGuard ),
  );
}