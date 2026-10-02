import type { LimitRuleApprove } from "./LimitRuleApprove.js";
import type { LimitRuleSecurityDelay } from "./LimitRuleSecurityDelay.js";

export interface LimitRule {
  approve?: LimitRuleApprove;
  securityDelay?: LimitRuleSecurityDelay;
  skipApproval?: boolean;
}
