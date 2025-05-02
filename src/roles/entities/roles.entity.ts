import { User } from "src/auth/entities/user.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity('roles')
export class Roles {

    @PrimaryGeneratedColumn()
    id: number;

    @Column('text')
    rolNombre: string;

    @OneToMany(
        () => User,
        user => user.role
      )
      users: User[];
}
