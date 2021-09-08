import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Issue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
}
