import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AlertService } from './alert.service';
import {
  AddContactDto,
  AddRuleDto,
  DeleteContactDto,
  RuleToggleDto,
  UpdateRuleDto,
} from './alert.dto';
import { AlertContact, AlertRule } from 'libs/datasource';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@ApiTags('alert')
@Controller()
export class AlertController {
  constructor(private readonly alertService: AlertService) {}

  private readonly logger = new Logger(AlertController.name);

  @Get('manager/alert')
  async getAlertRules(
    @Query('projectId') projectId: number,
  ): Promise<AlertRule[]> {
    return await this.alertService.queryRule(projectId);
  }

  @Put('manager/alert/rule')
  async ruleAdd(@Body() addRuleDto: AddRuleDto): Promise<{ success: true }> {
    const rule = await this.alertService.createRule(addRuleDto);

    const userIds = addRuleDto.userIds;
    if (Array.isArray(userIds)) {
      userIds.every(async (userId) => {
        await this.alertService.addRuleContact(rule.id, userId);
      });
    }

    return { success: true };
  }

  @Post('manager/alert/rule')
  async ruleUpdate(
    @Body() updateRuleDto: UpdateRuleDto,
  ): Promise<{ success: boolean }> {
    await this.alertService.updateRule(updateRuleDto);
    await this.alertService.updateRuleContact(
      updateRuleDto.id,
      updateRuleDto.userIds,
    );
    return { success: true };
  }

  @Delete('manager/alert/rule')
  async ruleRemove(
    @Query('ruleId') ruleId: number,
  ): Promise<{ success: true }> {
    await this.alertService.deleteRule(ruleId);
    return { success: true };
  }

  @Post('manager/alert/rule/toggle')
  async ruleToggle(
    @Body() ruleToggleDto: RuleToggleDto,
  ): Promise<{ success: true }> {
    const { ruleId, open } = ruleToggleDto;
    await this.alertService.toggleRule(ruleId, open);
    return { success: true };
  }

  @Get('manager/alert/contact')
  async contactList(@Query('ruleId') ruleId: number): Promise<AlertContact[]> {
    try {
      return await this.alertService.getRuleContacts(ruleId);
    } catch (e) {
      this.logger.error(e);
      return e;
    }
  }

  @Put('manager/alert/contact')
  async contactAdd(
    @Body() addContactDto: AddContactDto,
  ): Promise<{ success: boolean }> {
    const { ruleId, userId } = addContactDto;
    console.log(addContactDto);
    try {
      await this.alertService.addRuleContact(ruleId, userId);
    } catch (e) {
      this.logger.error(e);
    }
    return { success: true };
  }

  @Delete('manager/alert/contact')
  async contactRemove(
    @Body() deleteContactDto: DeleteContactDto,
  ): Promise<{ success: boolean }> {
    const { contactId } = deleteContactDto;
    try {
      await this.alertService.removeRuleContact(contactId);
    } catch (e) {
      this.logger.error(e);
    }
    return { success: true };
  }
}
