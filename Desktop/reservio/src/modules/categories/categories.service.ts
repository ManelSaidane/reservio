import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Categorie, Prisma } from '@prisma/client';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.CategorieCreateInput): Promise<Categorie> {
    return this.prisma.categorie.create({ data });
  }

  async findAll(): Promise<Categorie[]> {
    return this.prisma.categorie.findMany();
  }

  async findOne(id: number): Promise<Categorie> {
    return this.prisma.categorie.findUnique({ where: { ID: id } });
  }
  async findOneByName(name: string): Promise<Categorie> {
    return this.prisma.categorie.findFirst({ where: { Nom: name } });
  }

  async update(
    id: number,
    data: Prisma.CategorieUpdateInput,
  ): Promise<Categorie> {
    return this.prisma.categorie.update({ where: { ID: id }, data });
  }

  async remove(id: number): Promise<Categorie> {
    // Obtenir tous les services associés à la catégorie
    const services = await this.prisma.service.findMany({
      where: { categorieId: id },
      select: { ID: true },
    });

    const serviceIds = services.map((service) => service.ID);

    // Supprimer les favoris associés aux services de la catégorie
    await this.prisma.favoris.deleteMany({
      where: { serviceId: { in: serviceIds } },
    });

    // Supprimer les réservations associées aux services de la catégorie
    await this.prisma.reservation.deleteMany({
      where: { serviceId: { in: serviceIds } },
    });

    // Supprimer les avis associés aux services de la catégorie
    await this.prisma.review.deleteMany({
      where: { serviceId: { in: serviceIds } },
    });

    // Supprimer les services associés à la catégorie
    await this.prisma.service.deleteMany({
      where: { categorieId: id },
    });

    // Supprimer la catégorie
    return this.prisma.categorie.delete({
      where: { ID: id },
    });
  }

  async findAllWithNames(): Promise<{ id: number; name: string }[]> {
    const categories = await this.prisma.categorie.findMany({
      select: {
        ID: true,
        Nom: true,
      },
    });
    return categories.map((category) => ({
      id: category.ID,
      name: category.Nom,
    }));
  }
}
