import { PartialType } from '@nestjs/mapped-types';
import { CreateRolesDto } from './createroles.dto';

export class UpdateRolesDto extends PartialType(CreateRolesDto) {}
