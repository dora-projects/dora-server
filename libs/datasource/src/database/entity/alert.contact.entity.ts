import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

import { Project } from './project.entity';
import { User } from './user.entity';

@Entity()
export class AlertContact {
  @PrimaryGeneratedColumn()
  id: number;

  // 多对一
  @ManyToOne(() => Project, (project) => project.alertContacts)
  project: Project;

  // 多对一
  @ManyToOne(() => User, (user) => user.alertContacts)
  user: User;

  @Column({ type: 'text' })
  emails: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
