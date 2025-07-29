import { LimitRuleApprove } from './LimitRuleApprove.js';
import { LimitRuleSecurityDelay } from './LimitRuleSecurityDelay.js';

export interface LimitRule {
  approve?: LimitRuleApprove;
  securityDelay?: LimitRuleSecurityDelay;
  skipApproval?: boolean;
}
