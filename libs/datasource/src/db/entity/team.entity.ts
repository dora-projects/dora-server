import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

@Entity()
export class Team {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text', nullable: true })
  @Index({ unique: true })
  slug: string;

  // 多对多
  // @ManyToMany(() => User, (user) => user.teams)
  // users: User[];

  // 一对多
  // @OneToMany(() => Project, (project) => project.team)
  // projects: Project[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
