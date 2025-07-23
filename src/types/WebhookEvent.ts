export interface WebhookEvent {
  event: string;
  eventId: string;
  payload: { [key: string]: any };
  subscriptionId: string;
}
