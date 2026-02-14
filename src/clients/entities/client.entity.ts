import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ClientStatus } from '../enums/client-status.enum';
import { User } from 'src/users/entities/user.entity';
import { Note } from 'src/notes/entities/note.entity';
import { Task } from 'src/tasks/entities/task.entity';

@Entity('clients')
export class Client {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  phone: string;

  @Column()
  company: string;

  @Column({
    type: 'enum',
    enum: ClientStatus,
  })
  status: ClientStatus;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.clients)
  owner: User;

  @OneToMany(() => Note, (note) => note.client)
  notes: Note[];

  @OneToMany(() => Task, (task) => task.client)
  tasks: Task[];
}
