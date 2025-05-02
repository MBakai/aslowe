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
import { Roles } from 'src/roles/entities/roles.entity';
import { Colaborador } from 'src/colaboradores/entities/colaborador.entity';
@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,

    private readonly jwtService: JwtService,
    
    @InjectRepository(Genero)
    private readonly generoRepository: Repository<Genero>,

    @InjectRepository(Roles)
    private readonly rolesRepository: Repository<Roles>,

  ){}

  // ════════════════════════════════════════════════
  // 🧪 FUNC: crear usuario administrador con jwt
  // ════════════════════════════════════════════════
  async createUser(createUserDto: CreateUserDto) {

    try {
      
      const { password, confirmPassword, email, nombre } = createUserDto;
      //desestructuracion de argumentos, separa id_genero del resto de argumentos
  
      const genero = await this.generoRepository.findOneBy({id: createUserDto.id_genero});

      const verRole = await this.rolesRepository.findOneBy({ rolNombre: 'usuario' })

      if(password !== confirmPassword)
        throw new BadRequestException('Las contraseñas no coinciden!!')
      
      if(!genero)
        throw new NotFoundException('Genero no encontrado!!');

      if (!verRole) {
        throw new NotFoundException('¡Rol no encontrado!');
      }
  
      const nuevoUsuario = this.userRepository.create({
        nombre,
        email,
        password: bcrypt.hashSync(password, 10),
        genero, 
        role: verRole
      });

      await this.userRepository.save(nuevoUsuario);
      
      //Genera un token 
      const token = this.getJwtToken({ id: nuevoUsuario.id});
      
      const {password: _, role, ...usuario} = nuevoUsuario;

      return {...usuario, token};  //devuelve el token
  
    } catch (error) {

      this.handleDBErrors(error);
    }
  }

  
  // ════════════════════════════════════════════════
  // 🧪 FUNC: Obtener a todos los usuarios
  // ════════════════════════════════════════════════
  async findAll(userActual: User) {

    // trae el nombre del rol
    const isAdmin = userActual.role.rolNombre

    if (isAdmin === 'admin') {
      // Si es admin, trae TODOS
      return await this.userRepository.find({
        relations: ['role'], // Si necesitas los roles también
      });
    } else {
      // Si no es admin, trae todos MENOS los admins
      return await this.userRepository.createQueryBuilder('user')
        .leftJoinAndSelect('user.role', 'role')
        .where('role.rolNombre != :admin', { admin: 'admin' })
        .getMany();
    }
  }


  // ════════════════════════════════════════════════
  // 🧪 FUNC: Obtener usuario por ID  y token
  // ════════════════════════════════════════════════
  async findById(id: string, user: User) {
    // Primero buscamos el usuario solicitado
    const usuario = await this.userRepository.findOne({
      where: { id },
      relations: { genero: true }
    });
  
    if (!usuario) {
      throw new NotFoundException(`El usuario con el id ${id} no se encontró`);
    }

  
    return {
      ...usuario,
      token: this.getJwtToken({ id: user.id }), // Token del que pidió el dato
    };
  }


  // ════════════════════════════════════════════════
  // 🧪 FUNC: Login de usuario 
  // ════════════════════════════════════════════════
  async login(LoginUserDto: LoginUserDto) {

    const { email, password } = LoginUserDto;

    const user = await this.userRepository.findOne({
      where: { email },
      select: [ 'email', 'password', 'id', 'activo']
    });

    if(!user || !bcrypt.compareSync(password, user.password))
      throw new UnauthorizedException('Credenciales incorrectas' );

    // Validar si el usuario está activo
    if (!user.activo) {
      throw new UnauthorizedException('El usuario ya no está activo!!');
    }

    // Generar token (sin incluir la contraseña)
    const payload = { id: user.id };
    const token = this.getJwtToken(payload);

    return {
        ...payload,
        email: user.email,
        token,
    };

  }




  update(uuid: string, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${uuid} auth`;
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


  // ════════════════════════════════════════════════
  // 🧪 FUNC: crear usuario administrador con jwt
  // ════════════════════════════════════════════════
  async createAdmin(createUserDto: CreateUserDto) {

    try {
      
      const { password, confirmPassword, email, nombre } = createUserDto;
      //desestructuracion de argumentos, separa id_genero del resto de argumentos
  
      const genero = await this.generoRepository.findOneBy({id: createUserDto.id_genero});

      const role = await this.rolesRepository.findOneBy({ rolNombre: 'admin' })

      if(password !== confirmPassword)
        throw new BadRequestException('Las contraseñas no coinciden!!')
      
      if(!genero)
        throw new NotFoundException('Genero no encontrado!!');

      if (!role) {
        throw new NotFoundException('¡Rol no encontrado!');
      }
  
      const nuevoUsuario = this.userRepository.create({
        nombre,
        email,
        password: bcrypt.hashSync(password, 10),
        genero, 
        role // aqui tengo el error
      });

      console.log(nuevoUsuario);
      
      await this.userRepository.save(nuevoUsuario);
      
      //Genera un token 
      const token = this.getJwtToken({ id: nuevoUsuario.id});
      

      return {
        ...nuevoUsuario,
        token //devuelve el token
  
      };
    } catch (error) {

      this.handleDBErrors(error);
    }
  }

}
