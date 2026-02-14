import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { UserRole } from '../enums/user-role.enum';
import { Client } from 'src/clients/entities/client.entity';
import { Note } from 'src/notes/entities/note.entity';
import { Task } from 'src/tasks/entities/task.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
  })
  role: UserRole;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Client, (client) => client.owner)
  clients: Client[];

  @OneToMany(() => Note, (note) => note.createdBy)
  notes: Note[];

  @OneToMany(() => Task, (task) => task.assignedTo)
  tasks: Task[];
}
