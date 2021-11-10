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

  @Column()
  type: string;

  @Column({ type: 'integer' })
  total: number;

  @Column()
  value: string;

  @Column()
  url: string;

  @Column()
  release: string;

  @Column()
  environment: string;

  @Column()
  recently: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
