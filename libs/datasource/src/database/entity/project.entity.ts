import {
  Entity,
  Column,
  Index,
  OneToMany,
  OneToOne,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Team } from './team.entity';
import { AlertRule } from './alert.rule.entity';
import { AlertContact } from './alert.contact.entity';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  apiKey: string;

  @Column({ type: 'text' })
  @Index({ unique: true })
  name: string;

  @Column({ type: 'text' })
  type: string;

  // 一对多
  @OneToMany(() => Team, (team) => team.projects)
  team: Team;

  // 一对多
  @OneToMany(() => AlertRule, (alert) => alert.project)
  alertRules: AlertRule[];

  // 一对多
  @OneToOne(() => AlertContact, (alert) => alert.project)
  alertContacts: AlertContact[];

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
