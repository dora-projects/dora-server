import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinColumn,
  OneToOne,
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

  @Column({ type: 'text' })
  username: string;

  @Index({ unique: true })
  @Column({ type: 'text' })
  email: string;

  @Exclude({ toPlainOnly: true })
  @Column({ type: 'text' })
  password: string;

  @Column({ type: 'text', default: 'admin' })
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
