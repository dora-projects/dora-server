import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { AlertRule } from './alert.rule.entity';
import { User } from './user.entity';

// todo 扩展字段 webhook 支持 钉钉 飞书 等

@Entity()
export class AlertContact {
  @PrimaryGeneratedColumn()
  id: number;

  // 多对一
  @ManyToOne(() => AlertRule, (rule) => rule.contacts)
  rule: AlertRule;

  // 一对一
  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
