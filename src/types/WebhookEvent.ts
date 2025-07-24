export interface WebhookEvent {
  event: string;
  eventId: string;
  payload: Record<string, any>;
  subscriptionId: string;
}
