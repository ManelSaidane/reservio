import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { PrismaModule } from 'prisma/prisma.module';
import { ReviewController } from './reviews.controller';

@Module({
  imports: [PrismaModule],
  providers: [ReviewService],
  controllers: [ReviewController],
  exports: [ReviewModule],
})
export class ReviewModule {}
