import {
  Entity,
  Column,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

import { Project } from './project.entity';
import { User } from './user.entity';

export enum ProjectRoleEnum {
  Owner = 'owner',
  Developer = 'developer',
}

@Entity()
export class ProjectRoles {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: ProjectRoleEnum,
    default: ProjectRoleEnum.Developer,
    comment: '项目角色',
  })
  projectRole: ProjectRoleEnum;

  @ManyToOne(() => Project, (project) => project.projectRoles)
  project: Project;

  @ManyToOne(() => User, (user) => user.projectRoles)
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
