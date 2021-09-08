import { Entity, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';

import { Team } from './team.entity';
import { User } from './user.entity';

@Entity()
export class UserDashboard {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.dashboard)
  @JoinColumn()
  user: User;

  @OneToOne(() => Team, (team) => team.dashboard)
  @JoinColumn()
  currentTeam: Team;
}
