import { LimitAmount } from './LimitAmount.js';

export interface LimitTransactionParams {
  aboveAmount?: LimitAmount;
  durationHours?: string;
}
