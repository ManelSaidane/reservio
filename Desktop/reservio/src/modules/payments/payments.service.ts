import { Injectable, Logger } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class PaymentService {
  private readonly stripe: Stripe;
  private readonly logger = new Logger(PaymentService.name);

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-06-20',
    });
  }

  async getPaymentHistory(email: string) {
    this.logger.debug(`Fetching payment history for email: ${email}`);
    const payments = await this.stripe.paymentIntents.list({
      limit: 100,
    });

    this.logger.debug(`Total payments fetched: ${payments.data.length}`);
    payments.data.forEach((payment) => {
      this.logger.debug(`Payment email: ${payment.receipt_email}`);
      this.logger.debug(`Payment metadata email: ${payment.metadata.email}`);
    });

    const filteredPayments = payments.data.filter(
      (payment) =>
        payment.receipt_email === email || payment.metadata.email === email,
    );
    this.logger.debug(`Filtered payments count: ${filteredPayments.length}`);

    return filteredPayments;
  }
}
