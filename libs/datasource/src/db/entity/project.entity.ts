import {
  Entity,
  Column,
  Index,
  OneToMany,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

import { Team } from './team.entity';
import { AlertRule } from './alert.rule.entity';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  @Index({ unique: true })
  apiKey: string;

  @Column({ type: 'text' })
  @Index({ unique: true })
  name: string;

  @Column({ type: 'text' })
  type: string;

  // 多对一
  @ManyToOne(() => Team, (team) => team.projects)
  team: Team;

  // 一对多
  @OneToMany(() => AlertRule, (alertRule) => alertRule.project)
  alertRules: AlertRule[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
