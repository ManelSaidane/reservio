import { Controller, Post, Body, Req, Param, Get } from '@nestjs/common';
import { ReviewService } from './review.service';
import { RequestWithUser } from 'common/interfaces/RequestWithUser';
import { CreateReviewDto } from './create-review.dto';
import { Review } from '@prisma/client';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  async createReview(
    @Body() reviewDto: CreateReviewDto,
    @Req() req: RequestWithUser,
  ): Promise<Review> {
    const userId = req.user.id;
    return await this.reviewService.create(userId, reviewDto);
  }

  @Get('service/:serviceId')
  async getReviewsByServiceId(
    @Param('serviceId') serviceId: string,
  ): Promise<Review[]> {
    return this.reviewService.findReviewsByServiceId(+serviceId);
  }

  @Get('service/:serviceId/details')
  async getReviewsWithDetailsByServiceId(
    @Param('serviceId') serviceId: string,
  ): Promise<any[]> {
    const reviews =
      await this.reviewService.findReviewsWithDetailsByServiceId(+serviceId);
    return reviews.map((review) => ({
      id: review.id,
      stars: review.stars,
      comment: review.comment,
      createdAt: review.createdAt,
      service: {
        id: review.serviceId,
      },
      user: {
        id: review.userId,
      },
    }));
  }

  @Get('most-reviewed-per-service')
  async getMostReviewedPerService() {
    const mostReviewed = await this.reviewService.findMostReviewedPerService();
    return mostReviewed;
  }

  @Get('max-stars-per-service')
  async getMaxStarsPerService() {
    return this.reviewService.findMaxStarsPerService();
  }

  @Get('most-frequent/:serviceId')
  async getMostFrequentReview(@Param('serviceId') serviceId: number) {
    return this.reviewService.getMostFrequentReview(serviceId);
  }
}
