import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Estados } from '../../estados/entities/estados.entity';
import { User } from "src/auth/entities/user.entity";
import { Subtask } from "src/sub-task/entities/sub-task.entity";

@Entity()
export class Task { 

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    titulo: string;

    @Column()
    descripcion: string;

    @ManyToOne( 
        () => Estados,
        ( estados ) => estados.tasks)
    @JoinColumn({ name: 'id_estado' })
    estados: Estados;

    // Relación con el creador de la tarea
    @ManyToOne(() => User)
    @JoinColumn({ name: 'creador_id' })
    creador: User;

    @OneToMany(
        () => Subtask,
         subtask => subtask.task)
    subtasks: Subtask[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({ nullable: true })
    completedAt: Date;

}
