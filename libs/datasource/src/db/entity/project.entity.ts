import {
  Entity,
  Column,
  Index,
  OneToMany,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToMany,
} from 'typeorm';

import { AlertRule } from './alert.rule.entity';
import { User } from 'libs/datasource/db/entity/user.entity';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  @Index({ unique: true })
  appKey: string;

  @Column({ type: 'text' })
  type: string;

  @Column({ type: 'text' })
  @Index({ unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  detail: string;

  // 多对一
  // @ManyToOne(() => Team, (team) => team.projects)
  // team: Team;

  // 多对多
  @ManyToMany(() => User, (pro) => pro.projects, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  users: User[];

  // 一对多
  @OneToMany(() => AlertRule, (alertRule) => alertRule.project, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  alertRules: AlertRule[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
