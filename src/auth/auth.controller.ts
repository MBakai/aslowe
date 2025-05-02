import { Controller, Get, Post, Body, Patch, Param, Delete} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { CreateUserDto } from './dto/create.user.dto';
import { LoginUserDto } from './dto/login.user.dto';
import { Auth } from './decorators/auth.decorator';
import { GetUser } from './decorators/get-user.decorator';
import { User } from './entities/user.entity';

@Controller('user')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  createUser(@Body() createUserDto: CreateUserDto) {
    return this.authService.createUser(createUserDto);
  }

  @Get()
  @Auth('admin', 'usuario')
  findAll(@GetUser() user: User) {
    return this.authService.findAll(user);
  }

  @Get('get-user/:uuid')
  @Auth('usuario')
  findById(@Param('uuid') uuid: string, 
  @GetUser() user: User){
      return this.authService.findById(uuid, user)
    }

  @Get('login')
  login(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Patch('update/:uuid')
  update(@Param('id') uuid: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(uuid, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }


  @Post('create-admin')
  createAdmin(@Body() createUserDto: CreateUserDto) {
    return this.authService.createAdmin(createUserDto);
  }
}
