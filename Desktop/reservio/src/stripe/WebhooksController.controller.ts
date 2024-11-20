import {
  Controller,
  Post,
  Body,
  Headers,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import Stripe from 'stripe';
import { StripeService } from './stripe.service';

@Controller('webhooks')
export class WebhooksController {
  private stripe: Stripe;

  constructor(private readonly stripeService: StripeService) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2024-06-20',
    });
  }

  @Post('stripe')
  async handleStripeWebhook(
    @Body() payload: any,
    @Headers('stripe-signature') signature: string,
  ) {
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    try {
      // Vérifier la signature de Stripe
      const event = this.stripe.webhooks.constructEvent(
        JSON.stringify(payload),
        signature,
        endpointSecret,
      );

      if (event.type === 'checkout.session.completed') {
        const sessionId = event.data.object.id;
        await this.stripeService.handlePaymentSuccess(sessionId);
      }

      return { received: true };
    } catch (err) {
      console.error(`Webhook error: ${err.message}`);
      throw new HttpException('Webhook error', HttpStatus.BAD_REQUEST);
    }
  }
}
