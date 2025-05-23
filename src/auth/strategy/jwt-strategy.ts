import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { User } from '../entities/user.entity';
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from 'typeorm';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtPayload } from "../interface/jwt.payload.interface";


@Injectable()
export class JwtStrategy extends PassportStrategy( Strategy){

    constructor(

        @InjectRepository(User)
        private readonly userRepository: Repository<User>,

        configService: ConfigService
    ){

        super({
            jwtFromRequest:ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: configService.get('JWT_SECRET')!,
        });
    }

    async validate( payload: JwtPayload ): Promise<User> {

        const { id } = payload;

        const user = await this.userRepository.findOneBy({ id });

        if(!user)
            throw new UnauthorizedException('Token not valid!!!');

        if(!user.activo)
            throw new UnauthorizedException('El usuario ya no esta activo!!');
        
        return user;

    }

}

