import { Body, Controller, Post, Req } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { RequestWithUser } from 'common/interfaces/RequestWithUser';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Post('create-checkout-session')
  async createCheckoutSession(@Req() req: RequestWithUser) {
    const userId = req.user?.id;
    console.log('User ID from JWT:', userId);
    if (!userId) {
      throw new Error('User ID not found in request');
    }
    const amount = 10000; // 10000 centimes = 100 unités de la devise

    const session = await this.stripeService.createCheckoutSession(
      userId,
      amount,
      'usd',
    );

    return { id: session.id };
  }

  @Post('handle-payment-success')
  async handlePaymentSuccess(@Body() body: { sessionId: string }) {
    const { sessionId } = body;
    try {
      await this.stripeService.handlePaymentSuccess(sessionId);
      return { success: true };
    } catch (error) {
      console.error('Failed to handle payment success:', error);
      return { success: false, error: error.message };
    }
  }
}
