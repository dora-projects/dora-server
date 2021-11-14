import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';

@Entity()
@Unique(['fingerprint', 'appKey'])
export class Issue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fingerprint: string;

  @Column()
  appKey: string;

  @Column({ nullable: true })
  type: string;

  @Column({ nullable: true })
  value: string;

  @Column({ nullable: true })
  url: string;

  @Column({ nullable: true })
  release: string;

  @Column({ nullable: true })
  environment: string;

  @Column({ type: 'integer' })
  total: number;

  @Column()
  recently: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
