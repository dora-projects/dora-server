import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinColumn,
  OneToMany,
  OneToOne,
} from 'typeorm';

import { AlertContact } from './alert.contact.entity';
import { Team } from './team.entity';
import { UserDashboard } from './user.dashboard.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  username: string;

  @Column({ type: 'text' })
  email: string;

  @Column({ type: 'text' })
  password: string;

  @Column({ type: 'text' })
  role: string;

  @Column({ default: false })
  isActive: boolean;

  // 多对多
  @ManyToMany(() => Team, (team) => team.users)
  @JoinColumn()
  teams: Team[];

  // 一对多
  @OneToMany(() => AlertContact, (alert) => alert.user)
  alertContacts: AlertContact[];

  // 一对一
  @OneToOne(() => UserDashboard, (userDashboard) => userDashboard.user)
  dashboard: UserDashboard;
}
