import { Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Estados } from '../../estados/entities/estados.entity';
import { User } from "src/auth/entities/user.entity";
import { UserTask } from "src/user-task/user-task.entity";

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
    @ManyToOne(
        () => User,
         (user) => user.crearTasks)
    @JoinColumn({name:' user_id '})
    creador: User; // ¡Este es el campo que faltaba!

    // Relación con User
    @OneToMany(
        () => UserTask,
        (userTask) => userTask.task
      )
      userTasks: UserTask[]; // Usuarios que pueden editar la tarea

}
