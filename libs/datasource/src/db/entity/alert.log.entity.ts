import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Column,
} from 'typeorm';

import { AlertRule } from './alert.rule.entity';

@Entity()
export class AlertLog {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => AlertRule, (rule) => rule.logs)
  rule: AlertRule;

  @Column({ comment: '告警内容' })
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
