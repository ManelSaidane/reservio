import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service'; // Assurez-vous d'importer correctement le service Prisma
import { CreateReviewDto } from './create-review.dto';
import { Review } from '@prisma/client';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  async create(userId: number, reviewDto: CreateReviewDto): Promise<Review> {
    const { serviceId, stars } = reviewDto;

    return this.prisma.review.create({
      data: {
        stars,
        user: { connect: { ID: userId } }, // Connecte l'avis à l'utilisateur qui l'a créé
        service: { connect: { ID: serviceId } }, // Connecte l'avis au service concerné
      },
    });
  }

  async findReviewsByServiceId(serviceId: number): Promise<Review[]> {
    return this.prisma.review.findMany({
      where: { serviceId },
    });
  }

  async findReviewsWithDetailsByServiceId(
    serviceId: number,
  ): Promise<Review[]> {
    return this.prisma.review.findMany({
      where: { serviceId },
      include: {
        user: true,
        service: true,
      },
    });
  }

  async findMostReviewedPerService(): Promise<any> {
    const services = await this.prisma.review.groupBy({
      by: ['serviceId'],
      _count: {
        id: true, // Compte le nombre d'avis pour chaque service
      },
      orderBy: {
        _count: {
          id: 'desc', // Trie par le nombre d'avis
        },
      },
    });

    const mostReviewedPerService = await Promise.all(
      services.map(async (service) => {
        const mostReviewed = await this.prisma.review.findFirst({
          where: { serviceId: service.serviceId },
          orderBy: { createdAt: 'desc' }, // Vous pouvez ajuster le critère de tri si nécessaire
        });
        return {
          serviceId: service.serviceId,
          review: mostReviewed,
          count: service._count.id,
        };
      }),
    );

    return mostReviewedPerService;
  }

  async findMaxStarsPerService(): Promise<any[]> {
    const services = await this.prisma.review.groupBy({
      by: ['serviceId'],
      _max: {
        stars: true, // Obtenez la note maximale
      },
    });

    return services.map((service) => ({
      serviceId: service.serviceId,
      maxStars: service._max.stars,
    }));
  }

  async getHighestRatedReview(serviceId: number) {
    return this.prisma.review.findFirst({
      where: { serviceId },
      orderBy: { stars: 'desc' },
    });
  }

  async getMostFrequentReview(serviceId: number) {
    // Compte le nombre de critiques pour chaque note
    const reviewsCount = await this.prisma.review.groupBy({
      by: ['stars'],
      _count: {
        stars: true,
      },
      where: {
        serviceId: serviceId,
      },
      orderBy: {
        _count: {
          stars: 'desc',
        },
      },
    });

    // Récupère la note la plus fréquente
    const mostFrequentStars = reviewsCount[0]?.stars;

    if (!mostFrequentStars) {
      return null;
    }

    // Trouve la critique avec la note la plus fréquente
    return this.prisma.review.findFirst({
      where: {
        serviceId: serviceId,
        stars: mostFrequentStars,
      },
    });
  }
}
