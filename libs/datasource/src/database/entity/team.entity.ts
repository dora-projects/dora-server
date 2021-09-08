import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { UserDashboard } from './user.dashboard.entity';
import { Project } from 'libs/datasource/database/entity/project.entity';

@Entity()
export class Team {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text' })
  slug: string;

  @ManyToMany(() => User, (user) => user.teams)
  @JoinColumn()
  users: User[];

  // 一对多
  @OneToMany(() => Project, (project) => project.team)
  @JoinColumn()
  projects: Project[];

  // 一对一
  @OneToOne(() => UserDashboard, (userBoard) => userBoard.user)
  @JoinColumn()
  dashboard: UserDashboard;
}
