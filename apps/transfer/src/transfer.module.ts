import { Module } from '@nestjs/common';
import { TransferController } from './transfer.controller';
import { TransferService } from './transfer.service';

@Module({
  imports: [],
  controllers: [TransferController],
  providers: [TransferService],
})
export class TransferModule {}
