import {
  Entity,
  Column,
  Index,
  OneToMany,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToMany,
} from 'typeorm';

import { AlertRule } from './alert.rule.entity';
import { User } from 'libs/datasource/db/entity/user.entity';
import { AlertLog } from './alert.log.entity';
import { ProjectRoles } from './project.roles.entity';

export enum ProjectType {
  React = 'react',
  Vue = 'vue',
  Web = 'web',
}

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index({ unique: true })
  appKey: string;

  @Column({
    type: 'enum',
    enum: ProjectType,
    default: ProjectType.Web,
    comment: '项目类型',
  })
  type: ProjectType;

  @Column({ comment: '项目名' })
  @Index({ unique: true })
  name: string;

  @Column({ nullable: true, comment: '项目描述' })
  detail: string;

  // @ManyToOne(() => Team, (team) => team.projects)
  // team: Team;

  @ManyToMany(() => User, (pro) => pro.projects, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  users: User[];

  @OneToMany(() => AlertRule, (alertRule) => alertRule.project, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  alertRules: AlertRule[];

  @OneToMany(() => AlertLog, (alertLog) => alertLog.project, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  alertLogs: AlertLog[];

  @OneToMany(() => ProjectRoles, (pr) => pr.project, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  projectRoles: ProjectRoles[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
