import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Project } from './project.entity';
import { User } from './user.entity';

@Entity()
export class UserDashboard {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => Project, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  project: Project;

  @OneToOne(() => User, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
