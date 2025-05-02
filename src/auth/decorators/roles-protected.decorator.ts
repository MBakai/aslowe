import { SetMetadata } from '@nestjs/common';

export const META_ROLES = 'role';

export const RolesProtected = (...role: string[]) => {
    return SetMetadata(META_ROLES, role);
};