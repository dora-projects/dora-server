import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { Project } from './project.entity';
import { AlertRuleData } from 'libs/shared/types';

@Entity()
export class AlertRule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'jsonb' })
  data: AlertRuleData;

  @Column({ type: 'integer', default: 30 * 60 * 60 })
  silence: number;

  @Column({ type: 'bool', default: true })
  open: boolean;

  @Column({ type: 'timestamp', nullable: true })
  recently?: Date;

  @Column({ type: 'integer', default: 0 })
  count: number;

  // 多对一
  @ManyToOne(() => Project, (project) => project.alertRules)
  @JoinColumn()
  project: Project;

  @CreateDateColumn({ type: 'timestamp with time zone' })
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
