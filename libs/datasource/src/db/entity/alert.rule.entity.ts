import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Project } from './project.entity';
import { AlertContact } from './alert.contact.entity';

@Entity()
export class AlertRule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', comment: '规则名字' })
  name: string;

  @Column({ type: 'jsonb', comment: '事件筛选' })
  filter: {
    key: string;
    value: string;
  }[];

  @Column({ type: 'integer', comment: '间隔（秒）' })
  thresholdsTime: number;

  @Column({ type: 'text', default: '>', comment: '上限 或者 下限' })
  thresholdsOperator: string;

  @Column({ type: 'integer', comment: '次数' })
  thresholdsQuota: number;

  @Column({ type: 'integer', default: 10, comment: '静默（分钟）' })
  silence: number;

  @Column({ type: 'bool', default: true, comment: '是否开启' })
  open: boolean;

  // 多对一
  @ManyToOne(() => Project, (project) => project.alertRules)
  project: Project;

  // 一对多
  @OneToMany(() => AlertContact, (contact) => contact.rule)
  contacts: AlertContact[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
