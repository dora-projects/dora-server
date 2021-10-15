import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinColumn,
  OneToMany,
  OneToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinTable,
  Index,
} from 'typeorm';
import { classToPlain, Exclude } from 'class-transformer';

import { AlertContact } from './alert.contact.entity';
import { Team } from './team.entity';
import { UserDashboard } from './user.dashboard.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  username: string;

  @Index({ unique: true })
  @Column({ type: 'text' })
  email: string;

  @Exclude({ toPlainOnly: true })
  @Column({ type: 'text' })
  password: string;

  @Column({ type: 'text' })
  role: string;

  @Column({ default: false })
  isActive: boolean;

  // 多对多
  @ManyToMany(() => Team, (team) => team.users)
  @JoinTable()
  teams: Team[];

  // 一对一
  @OneToOne(() => UserDashboard)
  @JoinColumn()
  dashboard: UserDashboard;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  toJSON() {
    return classToPlain(this);
  }
}
