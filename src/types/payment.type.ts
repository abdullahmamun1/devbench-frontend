export type PaymentStatus = "PENDING" | "SUCCEEDED" | "FAILED";

export interface Payment {
  id: string;
  companyId: string;
  stripeSessionId: string;
  amount: number;
  status: PaymentStatus;
  creditsPurchased: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCheckoutPayload {
  credits: number;
}

export interface CheckoutSession {
  checkoutUrl: string | null;
  payment: Payment;
}
