import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Column,
} from 'typeorm';

import { AlertRule } from './alert.rule.entity';
import { Project } from './project.entity';

@Entity()
export class AlertLog {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => AlertRule, (rule) => rule.logs)
  rule: AlertRule;

  @ManyToOne(() => Project, (project) => project.alertLogs)
  project: Project;

  @Column({ comment: '告警内容' })
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
