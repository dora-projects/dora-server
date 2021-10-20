import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Project } from './project.entity';

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

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
