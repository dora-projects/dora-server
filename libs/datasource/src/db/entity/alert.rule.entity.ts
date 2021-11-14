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
import { AlertLog } from './alert.log.entity';

@Entity()
export class AlertRule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '规则名字' })
  name: string;

  @Column({ type: 'json', comment: '事件筛选' })
  filter: {
    key: string;
    value: string;
  }[];

  @Column({ comment: '间隔（秒）' })
  thresholdsTime: number;

  @Column({ default: '>', comment: '上限 或者 下限' })
  thresholdsOperator: string;

  @Column({ comment: '次数' })
  thresholdsQuota: number;

  @Column({ default: 10, comment: '静默（分钟）' })
  silence: number;

  @Column({ type: 'bool', default: true, comment: '是否开启' })
  open: boolean;

  @ManyToOne(() => Project, (project) => project.alertRules)
  project: Project;

  @OneToMany(() => AlertContact, (contact) => contact.rule)
  contacts: AlertContact[];

  @OneToMany(() => AlertLog, (log) => log.rule)
  logs: AlertLog[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
