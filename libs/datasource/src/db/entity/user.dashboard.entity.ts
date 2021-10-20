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

  // @OneToOne(() => Team)
  // @JoinColumn()
  // activeTeam: Team;

  @OneToOne(() => Project)
  @JoinColumn()
  project: Project;

  @OneToOne(() => User, (user) => user.dashboard)
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
