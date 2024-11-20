import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Promotion, Service } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class PromotionsService {
  constructor(private readonly prisma: PrismaService) {}
  async createPromotion(data: {
    discount: number;
    startDate: string;
    endDate: string;
    isGlobal?: boolean;
    serviceId?: number;
  }): Promise<Promotion> {
    const { discount, startDate, endDate, isGlobal = false, serviceId } = data;

    // Convertir les dates en objets Date pour vérifier leur validité
    const startDateTime = new Date(startDate);
    const endDateTime = new Date(endDate);

    if (isNaN(startDateTime.getTime()) || isNaN(endDateTime.getTime())) {
      throw new BadRequestException('Invalid date format');
    }

    // Vérifier si l'ID du service est fourni et valide
    if (serviceId !== undefined && serviceId !== null) {
      const serviceExists = await this.prisma.service.findUnique({
        where: { ID: serviceId },
      });
      if (!serviceExists) {
        throw new NotFoundException(`Service with ID ${serviceId} not found`);
      }
    }

    // Créer la promotion
    const promotion = await this.prisma.promotion.create({
      data: {
        discount,
        startDate: startDateTime.toISOString(),
        endDate: endDateTime.toISOString(),
        isGlobal,
        serviceId: serviceId ?? undefined,
      },
    });

    console.log('Promotion créée:', promotion);

    if (serviceId !== undefined && serviceId !== null) {
      console.log('Service ID trouvé, mise à jour du service');
      await this.updateServiceWithPromotion(serviceId, promotion);
    } else {
      console.log('Aucun Service ID fourni, aucune mise à jour du service');
    }

    return promotion;
  }

  private async updateServiceWithPromotion(
    serviceId: number,
    promotion: Promotion,
  ) {
    console.log(`Mise à jour du service avec ID ${serviceId}`);

    const service = await this.prisma.service.findUnique({
      where: { ID: serviceId },
    });

    if (!service) {
      throw new NotFoundException(`Service with ID ${serviceId} not found`);
    }

    const discountedPrice = service.Prix * (1 - promotion.discount / 100);

    const updatedService = await this.prisma.service.update({
      where: { ID: serviceId },
      data: {
        Titre: `PROMOTION - ${service.Titre}`, // Met à jour le titre pour inclure "PROMOTION"
        Prix: discountedPrice, // Met à jour le prix du service
        DateDebut: new Date(promotion.startDate), // Met à jour la date de début du service
        DateFin: new Date(promotion.endDate), // Met à jour la date de fin du service
        Description: `Profitez de notre PROMOTION , avec ${promotion.discount}% de Reduction !! `, // Modifie la description en ajoutant une mention de la promotion
      },
    });
    console.log('Service mis à jour:', updatedService);
  }

  async findAllPromotions(): Promise<Promotion[]> {
    return this.prisma.promotion.findMany({
      include: {
        service: true,
      },
    });
  }

  async findPromotionById(id: number): Promise<Promotion> {
    return this.prisma.promotion.findUnique({
      where: { id },
      include: {
        service: true,
      },
    });
  }

  async updatePromotion(
    id: number,
    data: Partial<Promotion>,
  ): Promise<Promotion> {
    return this.prisma.promotion.update({
      where: { id },
      data,
    });
  }

  async deletePromotion(id: number): Promise<Promotion> {
    return this.prisma.promotion.delete({
      where: { id },
    });
  }

  // private async updateServiceWithPromotion(
  //   serviceId: number,
  //   promotion: Promotion,
  // ) {
  //   const service = await this.prisma.service.findUnique({
  //     where: { ID: serviceId },
  //   });

  //   if (!service) {
  //     throw new NotFoundException(`Service with ID ${serviceId} not found`);
  //   }

  //   // Calculer le prix avec la promotion
  //   const discountedPrice = service.Prix * (1 - promotion.discount / 100);

  //   // Mettre à jour le prix et les dates du service avec les dates de promotion
  //   await this.prisma.service.update({
  //     where: { ID: serviceId },
  //     data: {
  //       Prix: discountedPrice, // Met à jour le prix du service
  //       DateDebut: new Date(promotion.startDate), // Met à jour la date de début du service
  //       DateFin: new Date(promotion.endDate), // Met à jour la date de fin du service
  //     },
  //   });
  // }

  private async removePromotionFromService(
    serviceId: number,
    promotionId: number,
  ) {
    const service = await this.prisma.service.findUnique({
      where: { ID: serviceId },
    });

    if (!service) {
      throw new NotFoundException(`Service with ID ${serviceId} not found`);
    }

    await this.prisma.service.update({
      where: { ID: serviceId },
      data: {
        promotions: {
          delete: {
            id: promotionId,
          },
        },
      },
    });
  }
}
