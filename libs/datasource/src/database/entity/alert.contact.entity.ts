import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToOne,
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
  @ManyToOne(() => Project, (project) => project.alertContacts, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  project: Project;

  // 多对一
  @OneToOne(() => User, (user) => user.alertContacts, {
    onDelete: 'CASCADE',
  })
  user: User;

  @Column({ type: 'text' })
  emails: string;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
