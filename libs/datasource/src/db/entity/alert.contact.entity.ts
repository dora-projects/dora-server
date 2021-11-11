import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToOne,
  JoinColumn,
  Column,
} from 'typeorm';

import { AlertRule } from './alert.rule.entity';
import { User } from './user.entity';

export enum ContactType {
  User = 'user',
  DING = 'ding',
}

// todo 扩展字段 webhook 支持 钉钉 飞书 等
@Entity()
export class AlertContact {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: ContactType,
    default: ContactType.User,
    comment: '通知类型',
  })
  type: string;

  @ManyToOne(() => AlertRule, (rule) => rule.contacts)
  rule: AlertRule;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
