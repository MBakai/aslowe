import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { GeneroService } from './genero.service';

@Controller('genero')
export class GeneroController {
  constructor(private readonly generoService: GeneroService) {}


}
