import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User, UserDashboard } from 'libs/datasource';

@Module({
  imports: [TypeOrmModule.forFeature([User, UserDashboard])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}
