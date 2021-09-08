import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class IssueStatus {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
