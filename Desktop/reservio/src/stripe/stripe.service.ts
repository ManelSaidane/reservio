import { Injectable, Logger } from '@nestjs/common';
import { MailerService } from 'common/interfaces/mail.service';
import { UsersService } from 'src/modules/users/users.service';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;
  private readonly logger = new Logger(StripeService.name);

  constructor(
    private readonly userService: UsersService,
    private readonly mailerService: MailerService,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-06-20',
    });
  }

  async createCheckoutSession(
    userId: number,
    amount: number,
    currency: string,
  ) {
    const user = await this.userService.findUserById(userId);
    const email = user.Email;

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency,
            product_data: {
              name: 'Fixed Price Product',
            },
            unit_amount: amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url:
        'http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: 'http://localhost:5173/cancel',
      customer_email: email,
      metadata: { email: email },
    });

    return session;
  }

  async handlePaymentSuccess(sessionId: string) {
    try {
      const session = await this.stripe.checkout.sessions.retrieve(sessionId);
      const email = session.customer_email || session.metadata.email; // Utilisez email depuis metadata si customer_email est null
      const amount = session.amount_total;

      const paymentDetails = {
        amount,
        currency: session.currency,
        email,
      };
      console.log(paymentDetails);

      if (this.mailerService) {
        await this.mailerService.sendAdminPaymentNotification(paymentDetails);
        await this.mailerService.sendUserPaymentConfirmation(
          email,
          paymentDetails,
        );
      } else {
        this.logger.error('MailerService is not available.');
      }

      this.logger.log('Payment success handled successfully');
    } catch (error) {
      this.logger.error(
        `Failed to handle payment success: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
