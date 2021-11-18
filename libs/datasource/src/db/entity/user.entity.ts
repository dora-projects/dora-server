import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  CreateDateColumn,
  UpdateDateColumn,
  JoinTable,
  Index,
} from 'typeorm';
import { classToPlain, Exclude } from 'class-transformer';
import { Project } from 'libs/datasource/db/entity/project.entity';

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

  // 多对多
  // @ManyToMany(() => Team, (team) => team.users)
  // @JoinTable()
  // teams: Team[];

  // 多对多
  @ManyToMany(() => Project, (pro) => pro.users)
  @JoinTable()
  projects: Project[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  toJSON() {
    return classToPlain(this);
  }
}
