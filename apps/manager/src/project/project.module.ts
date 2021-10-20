import { Module } from '@nestjs/common';
import { ProjectController } from './project.controller';
import { ProjectService } from './project.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from 'libs/datasource';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../auth/constants';
import { JwtStrategy } from '../auth/strategies/jwt.strategy';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Project])],
  controllers: [ProjectController],
  providers: [ProjectService],
})
export class ProjectModule {}
