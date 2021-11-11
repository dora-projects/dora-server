import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class AddRuleDto {
  @ApiProperty({ description: '项目id' })
  projectId: number;

  @ApiProperty({ description: '规则名字' })
  name: string;

  @ApiProperty({ description: '事件筛选' })
  filter: any;

  @ApiProperty({ description: '间隔（秒）' })
  thresholdsTime: number;

  @ApiProperty({ description: '上限下限' })
  thresholdsOperator: string;

  @ApiProperty({ description: '次数' })
  thresholdsQuota: number;

  @ApiProperty({ description: '静默时间（分钟）' })
  silence: number;

  @ApiProperty({ description: '联系人 Id' })
  userIds: number;
}

export class UpdateRuleDto extends AddRuleDto {
  @ApiProperty({ description: '规则 id' })
  id: number;
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
