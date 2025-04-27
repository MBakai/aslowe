import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { CreateUserDto } from './dto/create.user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interface/jwt.payload.interface';
import { LoginUserDto } from './dto/login.user.dto';
import { Genero } from 'src/genero/entities/genero.entitys';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,
    
    @InjectRepository(Genero)
    private readonly generoRepository: Repository<Genero>

    
  ){}

  // ════════════════════════════════════════════════
  // 🧪 FUNC: crear usuario y generar JWT
  // ════════════════════════════════════════════════
  async create(createUserDto: CreateUserDto) {

    try {
      
      const { id_genero, password, confirmPassword, email, nombre } = createUserDto;
      //desestructuracion de argumentos, separa id_genero del resto de argumentos
  
      const genero = await this.generoRepository.findOneBy({id: createUserDto.id_genero});

      if(password !== confirmPassword)
        throw new BadRequestException('Las contraseñas no coinciden!!')
      
      if(!genero)
        throw new NotFoundException('Genero no encontrado!!');
  
      const nuevoUsuario = this.userRepository.create({
        nombre,
        email,
        password: bcrypt.hashSync(password, 10),
        genero
      });
      await this.userRepository.save(nuevoUsuario);
      
      //Genera un token 
      const token = this.getJwtToken({ id: nuevoUsuario.id});

      console.log(this.userRepository);
      
      console.log(token);
      

      return {
        ...nuevoUsuario,
        token //devuelve el token
  
      };
    } catch (error) {
      this.handleDBErrors(error);
    }
  }

  findAll(user: User) {
    return this.userRepository.find();
  }


  // ════════════════════════════════════════════════
  // 🧪 FUNC: Login de usuario 
  // ════════════════════════════════════════════════
  async login(LoginUserDto: LoginUserDto) {

    const { email, password } = LoginUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: { email: true, password: true, id: true }
    });

    if(!user)
      throw new UnauthorizedException('Correo o contraseña incorrectos' );

    if( !bcrypt.compareSync(password, user.password) )
      throw new UnauthorizedException('Correo o contraseña incorrectos');

    return {
      ...user,
      token: this.getJwtToken({ id: user.id })
    };

  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }


  private getJwtToken(payload: JwtPayload){
    const token = this.jwtService.sign( payload );

    return token;
  }

  private handleDBErrors(error: any): never{
    if(error.code === '23505')
      throw new BadRequestException( error.detail );

    console.log(error);

    throw new InternalServerErrorException('Please check server logs');
    
  }

}
