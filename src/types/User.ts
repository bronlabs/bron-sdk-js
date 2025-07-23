export interface User {
  allowedIps?: string[];
  createdAt?: string;
  createdBy?: string;
  lastSignInAt?: string;
  userId: string;
}
