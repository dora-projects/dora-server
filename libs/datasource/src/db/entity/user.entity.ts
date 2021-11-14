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

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Index({ unique: true })
  @Column()
  email: string;

  @Exclude({ toPlainOnly: true })
  @Column()
  password: string;

  @Column({ default: 'admin' })
  role: string;

  @Column({ default: true })
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
