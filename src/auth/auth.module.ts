import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GeneroModule } from 'src/genero/genero.module';
import { Colaborador } from 'src/colaboradores/entities/colaborador.entity';
import { Roles } from 'src/roles/entities/roles.entity';
import { JwtStrategy } from './strategy/jwt-strategy';
import { Subtask } from 'src/sub-task/entities/sub-task.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ User, Roles, Colaborador, Subtask]),
    
    PassportModule.register({defaultStrategy: 'jwt'}),

    JwtModule.registerAsync({
      imports:[ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          secret: configService.get('JWT_SECRET'),
          signOptions: {
            expiresIn: '2h'
          }
        }
      }
    }),
    GeneroModule, Roles, Colaborador
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtStrategy, PassportModule, JwtModule],
})
export class AuthModule {}
