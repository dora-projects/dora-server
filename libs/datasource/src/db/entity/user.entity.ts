import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinTable,
  Index,
  OneToMany,
  DeleteDateColumn,
} from 'typeorm';
import { classToPlain, Exclude } from 'class-transformer';
import { Project } from 'libs/datasource/db/entity/project.entity';
import { ProjectRoles } from './project.roles.entity';

export enum Role {
  User = 'user',
  Admin = 'admin',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ comment: '用户名' })
  username: string;

  @Index({ unique: true })
  @Column({ comment: '邮箱' })
  email: string;

  @Exclude({ toPlainOnly: true })
  @Column({ comment: '密码' })
  password: string;

  @Column({
    type: 'enum',
    enum: Role,
    default: Role.User,
    comment: '角色',
  })
  role: Role;

  @Column({ default: true, comment: '是否激活' })
  isActive: boolean;

  // @ManyToMany(() => Team, (team) => team.users)
  // @JoinTable()
  // teams: Team[];

  @OneToMany(() => ProjectRoles, (pr) => pr.user, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  projectRoles: ProjectRoles[];

  @ManyToMany(() => Project, (pro) => pro.users)
  @JoinTable()
  projects: Project[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  toJSON() {
    return classToPlain(this);
  }
}
