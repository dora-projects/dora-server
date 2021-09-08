export type AlertRuleType = 'upperLimit' | 'lowerLimit';

export type AlertRuleData = {
  type: AlertRuleType;
  interval: number;
  count: number;
  limit: number;
  percentage: number;
};

export interface AlertRule {
  id: number;
  name: string;
  data: AlertRuleData;
  silence: number;
  open: boolean;
  recently?: Date;
  count: number;
}

export type UserRole = 'user' | 'visitor';
