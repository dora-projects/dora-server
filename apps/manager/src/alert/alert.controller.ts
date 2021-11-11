import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { AlertService } from './alert.service';
import {
  AddContactDto,
  AddRuleDto,
  DeleteContactDto,
  RuleToggleDto,
  UpdateRuleDto,
} from './alert.dto';
import { AlertContact, AlertRule } from 'libs/datasource';
import { UpdateResult } from 'typeorm';

@ApiTags('alert')
@Controller()
export class AlertController {
  constructor(private readonly alertService: AlertService) {}

  private readonly logger = new Logger(AlertController.name);

  @Get('manager/alert')
  async getAlertRules(
    @Query('projectId') projectId: number,
  ): Promise<AlertRule[]> {
    return await this.alertService.queryByProjectId(projectId);
  }

  @Put('manager/alert/rule')
  async ruleAdd(@Body() addRuleDto: AddRuleDto): Promise<AlertRule> {
    return await this.alertService.createRule(addRuleDto);
  }

  @Post('manager/alert/rule')
  async ruleUpdate(
    @Body() updateRuleDto: UpdateRuleDto,
  ): Promise<UpdateResult> {
    return await this.alertService.updateRule(updateRuleDto);
  }

  @Delete('manager/alert/rule')
  async ruleRemove(@Query('ruleId') ruleId: number): Promise<void> {
    return await this.alertService.deleteRule(ruleId);
  }

  @Post('manager/alert/rule/toggle')
  async ruleToggle(
    @Body() ruleToggleDto: RuleToggleDto,
  ): Promise<UpdateResult> {
    const { ruleId, open } = ruleToggleDto;
    return await this.alertService.toggleRule(ruleId, open);
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
  async contactAdd(@Body() addContactDto: AddContactDto): Promise<void> {
    const { ruleId, userId } = addContactDto;
    console.log(addContactDto);
    try {
      await this.alertService.addRuleContact(ruleId, userId);
    } catch (e) {
      this.logger.error(e);
    }
    return;
  }

  @Delete('manager/alert/contact')
  async contactRemove(
    @Body() deleteContactDto: DeleteContactDto,
  ): Promise<void> {
    const { contactId } = deleteContactDto;
    try {
      await this.alertService.removeRuleContact(contactId);
    } catch (e) {
      this.logger.error(e);
    }
    return;
  }
}
