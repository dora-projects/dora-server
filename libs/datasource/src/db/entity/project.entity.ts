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
import { AlertContact } from './alert.contact.entity';

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
  @OneToMany(() => AlertRule, (alert) => alert.project)
  alertRules: AlertRule[];

  // 一对多
  @OneToMany(() => AlertContact, (alert) => alert.project)
  alertContacts: AlertContact[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
