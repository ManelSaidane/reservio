import { Controller, Get, Query, Logger } from '@nestjs/common';
import { PaymentService } from './payments.service';

@Controller('payments')
export class PaymentController {
  private readonly logger = new Logger(PaymentController.name);

  constructor(private readonly paymentService: PaymentService) {}

  @Get('history')
  async getPaymentHistory(@Query('email') email: string) {
    this.logger.debug(
      `Received request to get payment history for email: ${email}`,
    );
    const paymentHistory = await this.paymentService.getPaymentHistory(email);
    this.logger.debug(
      `Payment history retrieved: ${JSON.stringify(paymentHistory)}`,
    );
    return paymentHistory;
  }
}
