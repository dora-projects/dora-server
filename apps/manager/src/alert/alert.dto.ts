import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

class FilterEvent {
  @ApiProperty({ description: '过滤 key' })
  name: string;

  @ApiProperty({ description: '过滤 value' })
  value: string;
}

export class AddRuleDto {
  @ApiProperty({ description: '项目id' })
  projectId: number;
  //
  @ApiProperty({ description: '规则名字' })
  name: string;

  @ApiProperty({ description: '事件筛选', type: [FilterEvent] })
  filterEvent: FilterEvent[];

  @ApiProperty({ description: '间隔 (秒)' })
  interval: number;

  @ApiProperty({ description: '上限下限' })
  thresholdsType: string;

  @ApiProperty({ description: '次数' })
  thresholdsCount: number;

  @ApiProperty({ description: '静默时间' })
  silence: number;
}

export class RuleToggleDto {
  @ApiProperty({ description: '规则 id' })
  ruleId: number;

  @ApiProperty({ description: '是否启用' })
  open: boolean;
}

export class AddContactDto {
  @ApiProperty({ description: '规则 id' })
  @IsNumber()
  ruleId: number;

  @ApiProperty({ description: '用户 id' })
  @IsNumber()
  userId: number;
}

export class DeleteContactDto {
  @ApiProperty({ description: '规则 id' })
  @IsNumber()
  contactId: number;
}
