import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';
import { Prisma, Service, User } from '@prisma/client';
import * as fs from 'fs/promises';
import { promises as fsPromises } from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { CreateServiceDto } from './service dto/create-service.dto';
import { UpdateServiceDto } from './service dto/update-service.dto';
import { EventsGateway } from 'common/helpers/EventsGateway';
import { MailerService } from 'common/interfaces/mail.service';

@Injectable()
export class ServicesService {
  private readonly logger = new Logger(ServicesService.name);
  constructor(
    private prisma: PrismaService,
    private readonly eventsGateway: EventsGateway,
    private mailerService: MailerService,
  ) {}

  // async saveImage(file: Express.Multer.File): Promise<string> {
  //   try {
  //     const imageDir = path.join(__dirname, '..', '..', '..', 'uploads');
  //     await fs.mkdir(imageDir, { recursive: true });

  //     const randomName = uuidv4();
  //     const fileName = `${randomName}${path.extname(file.originalname)}`;
  //     const filePath = path.join(imageDir, fileName);

  //     await fs.writeFile(filePath, file.buffer);

  //     return fileName;
  //   } catch (error) {
  //     throw new BadRequestException('Failed to save image.');
  //   }
  // }

  // async create(
  //   createServiceDto: CreateServiceDto,
  //   file: Express.Multer.File,
  // ): Promise<Service> {
  //   if (!createServiceDto.Description) {
  //     throw new BadRequestException('Description is required.');
  //   }

  //   const uploadedImage = await this.saveImage(file);
  //   const date = new Date(createServiceDto.Date);
  //   if (isNaN(date.getTime())) {
  //     throw new BadRequestException('Invalid date format');
  //   }

  //   return this.prisma.service.create({
  //     data: {
  //       Titre: createServiceDto.Titre,
  //       Description: createServiceDto.Description,
  //       Prix: createServiceDto.Prix,
  //       Date: date.toISOString(),
  //       Image: uploadedImage,
  //       Place: createServiceDto.Place,
  //       userId: createServiceDto.userId,
  //       categorieId: createServiceDto.categorieId,
  //     },
  //   });
  // }

  async saveImage(file: Express.Multer.File): Promise<string> {
    try {
      const imageDir = path.join(__dirname, '..', '..', '..', 'uploads'); // Chemin vers le dossier uploads
      await fs.mkdir(imageDir, { recursive: true }); // Créer le dossier s'il n'existe pas

      const randomName = uuidv4(); // Générer un nom de fichier unique
      const fileName = `${randomName}${path.extname(file.originalname)}`; // Nom complet avec extension
      const filePath = path.join(imageDir, fileName); // Chemin complet du fichier à enregistrer

      console.log('Saving file to:', filePath); // Log the file path

      await fs.writeFile(filePath, file.buffer); // Écrire le fichier dans le dossier

      return fileName; // Retourner le nom du fichier enregistré
    } catch (error) {
      throw new BadRequestException('Failed to save image.'); // Gérer les erreurs d'enregistrement
    }
  }

  // async create(
  //   createServiceDto: CreateServiceDto,
  //   file: Express.Multer.File,
  // ): Promise<Service> {
  //   if (!createServiceDto.Description) {
  //     throw new BadRequestException('Description is required.');
  //   }

  //   const uploadedImage = await this.saveImage(file);
  //   const dateD = new Date(createServiceDto.DateDebut);
  //   const dateF = new Date(createServiceDto.DateFin);
  //   // if (isNaN((dateD || dateF).getTime())) {
  //   //   throw new BadRequestException('Invalid date format');
  //   // }

  //   return this.prisma.service.create({
  //     data: {
  //       Titre: createServiceDto.Titre,
  //       Description: createServiceDto.Description,
  //       Prix: createServiceDto.Prix,
  //       DateDebut: dateD.toISOString(),
  //       DateFin: dateF.toISOString(),
  //       Image: uploadedImage,
  //       Place: createServiceDto.Place,
  //       userId: createServiceDto.userId,
  //       categorieId: createServiceDto.categorieId,
  //     },
  //   });

  // }
  //2//
  async create(
    createServiceDto: CreateServiceDto,
    file: Express.Multer.File,
  ): Promise<Service> {
    if (!createServiceDto.Description) {
      throw new BadRequestException('Description is required.');
    }

    const uploadedImage = await this.saveImage(file);
    const dateD = new Date(createServiceDto.DateDebut);
    const dateF = new Date(createServiceDto.DateFin);

    const newService = await this.prisma.service.create({
      data: {
        Titre: createServiceDto.Titre,
        Description: createServiceDto.Description,
        Prix: createServiceDto.Prix,
        DateDebut: dateD.toISOString(),
        DateFin: dateF.toISOString(),
        Image: uploadedImage,
        Place: createServiceDto.Place,
        userId: createServiceDto.userId,
        categorieId: createServiceDto.categorieId,
      },
    });

    this.eventsGateway.handleAddService(newService);

    return newService;
  }

  async findAll(): Promise<Service[]> {
    return this.prisma.service.findMany();
  }

  // async findOne(id: number): Promise<Service> {
  //   const service = await this.prisma.service.findUnique({
  //     where: {
  //       ID: id,
  //     },
  //   });

  //   if (!service) {
  //     throw new NotFoundException(`Service with ID ${id} not found`);
  //   }

  //   return service;
  // }
  async update(
    id: number,
    updateServiceDto: UpdateServiceDto,
    file: Express.Multer.File,
  ): Promise<Service> {
    const existingService = await this.prisma.service.findUnique({
      where: { ID: id },
    });

    if (!existingService) {
      throw new NotFoundException(`Service with ID ${id} not found.`);
    }

    let updatedImage = existingService.Image;
    if (file) {
      updatedImage = await this.saveImage(file);
      try {
        await fs.unlink(
          path.join(
            __dirname,
            '..',
            '..',
            '..',
            'uploads',
            existingService.Image,
          ),
        );
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }

    const updatedService = await this.prisma.service.update({
      where: { ID: id },
      data: {
        Titre: updateServiceDto.Titre || existingService.Titre,
        Description:
          updateServiceDto.Description || existingService.Description,
        Prix: updateServiceDto.Prix || existingService.Prix,
        DateDebut: updateServiceDto.DateDebut
          ? new Date(updateServiceDto.DateDebut).toISOString()
          : existingService.DateDebut,
        DateFin: updateServiceDto.DateFin
          ? new Date(updateServiceDto.DateFin).toISOString()
          : existingService.DateFin,
        Image: updatedImage,
        Place: updateServiceDto.Place || existingService.Place,
        userId: updateServiceDto.userId || existingService.userId,
        categorieId:
          updateServiceDto.categorieId || existingService.categorieId,
      },
    });

    // Émettre un événement pour notifier les clients
    this.eventsGateway.handleUpdateService(updatedService);

    return updatedService;
  }
  // async update(
  //   id: number,
  //   updateServiceDto: UpdateServiceDto,
  //   file: Express.Multer.File,
  // ): Promise<Service> {
  //   const existingService = await this.prisma.service.findUnique({
  //     where: { ID: id },
  //   });

  //   if (!existingService) {
  //     throw new NotFoundException(`Service with ID ${id} not found.`);
  //   }

  //   let updatedImage = existingService.Image;
  //   if (file) {
  //     updatedImage = await this.saveImage(file);
  //     try {
  //       await fs.unlink(
  //         path.join(
  //           __dirname,
  //           '..',
  //           '..',
  //           '..',
  //           'uploads',
  //           existingService.Image,
  //         ),
  //       );
  //     } catch (error) {
  //       console.error('Error deleting image:', error);
  //     }
  //   }

  //   const updatedService = await this.prisma.service.update({
  //     where: { ID: id },
  //     data: {
  //       Titre: updateServiceDto.Titre || existingService.Titre,
  //       Description:
  //         updateServiceDto.Description || existingService.Description,
  //       Prix: updateServiceDto.Prix || existingService.Prix,
  //       DateDebut: updateServiceDto.DateDebut
  //         ? new Date(updateServiceDto.DateDebut).toISOString()
  //         : existingService.DateDebut,
  //       DateFin: updateServiceDto.DateFin
  //         ? new Date(updateServiceDto.DateFin).toISOString()
  //         : existingService.DateFin,
  //       Image: updatedImage,
  //       Place: updateServiceDto.Place || existingService.Place,
  //       userId: updateServiceDto.userId || existingService.userId,
  //       categorieId:
  //         updateServiceDto.categorieId || existingService.categorieId,
  //     },
  //   });

  //   return updatedService;
  // }

  // async deleteService(id: number): Promise<void> {
  //   // Step 1: Find the service
  //   const service = await this.prisma.service.findUnique({
  //     where: { ID: id },
  //   });

  //   if (!service) {
  //     throw new NotFoundException(`Service with ID ${id} not found.`);
  //   }

  //   // Step 2: Delete related records
  //   try {
  //     // Delete related reservations
  //     await this.prisma.reservation.deleteMany({
  //       where: { serviceId: id },
  //     });

  //     // Delete related reviews
  //     await this.prisma.review.deleteMany({
  //       where: { serviceId: id },
  //     });

  //     // Delete related favorites
  //     await this.prisma.favoris.deleteMany({
  //       where: { serviceId: id },
  //     });
  //   } catch (error) {
  //     console.error('Error deleting related records:', error.message);
  //     throw new Error('Failed to delete related records.');
  //   }

  //   // Step 3: Delete the service
  //   try {
  //     await this.prisma.service.delete({
  //       where: { ID: id },
  //     });

  //     // Delete associated image file
  //     const imagePath = path.join(
  //       __dirname,
  //       '..',
  //       '..',
  //       '..',
  //       'uploads',
  //       service.Image,
  //     );

  //     try {
  //       await fs.access(imagePath); // Check if file exists
  //       await fs.unlink(imagePath); // Delete the file
  //       console.log('Image deleted successfully:', imagePath);
  //     } catch (fileError) {
  //       console.error('Error deleting image:', fileError.message);
  //     }
  //   } catch (error) {
  //     console.error('Error deleting service:', error.message);
  //     throw new Error(`Deletion failed: ${error.message}`);
  //   }
  // }
  async deleteService(id: number): Promise<void> {
    const service = await this.prisma.service.findUnique({
      where: { ID: id },
    });

    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found.`);
    }

    try {
      await this.prisma.reservation.deleteMany({
        where: { serviceId: id },
      });

      await this.prisma.review.deleteMany({
        where: { serviceId: id },
      });

      await this.prisma.favoris.deleteMany({
        where: { serviceId: id },
      });
    } catch (error) {
      console.error('Error deleting related records:', error.message);
      throw new Error('Failed to delete related records.');
    }

    try {
      await this.prisma.service.delete({
        where: { ID: id },
      });

      const imagePath = path.join(
        __dirname,
        '..',
        '..',
        '..',
        'uploads',
        service.Image,
      );

      try {
        await fs.access(imagePath);
        await fs.unlink(imagePath);
        console.log('Image deleted successfully:', imagePath);
      } catch (fileError) {
        console.error('Error deleting image:', fileError.message);
      }
    } catch (error) {
      console.error('Error deleting service:', error.message);
      throw new Error(`Deletion failed: ${error.message}`);
    }

    // Émettre un événement pour notifier les clients
    this.eventsGateway.handleDeleteService({ id });
  }
  async findUserById(userId: number): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { ID: userId } });
  }

  async getUserCount(): Promise<number> {
    return this.prisma.user.count();
  }
  async getServiceProviderCount(): Promise<number> {
    return this.prisma.user.count({
      where: {
        Role: 'SERVICE_PROVIDER',
      },
    });
  }

  async getClientCount(): Promise<number> {
    return this.prisma.user.count({
      where: {
        Role: 'CLIENT',
      },
    });
  }
  async getServiceCount(): Promise<number> {
    return this.prisma.service.count();
  }

  async getReservationCount(): Promise<number> {
    return this.prisma.reservation.count();
  }

  async findLatestSignups(limit: number): Promise<User[]> {
    return this.prisma.user.findMany({
      where: {
        Role: 'SERVICE_PROVIDER',
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    });
  }
  async findUserByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { Email: email } });
  }

  async findServicesByUserId(userId: number): Promise<Service[]> {
    // Vérifiez si l'utilisateur existe
    const user = await this.prisma.user.findUnique({
      where: { ID: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }

    return this.prisma.service.findMany({
      where: { userId: userId },
    });
  }

  async getCategoryNameById(categoryId: number): Promise<string | null> {
    const category = await this.prisma.categorie.findUnique({
      where: { ID: categoryId },
    });

    return category ? category.Nom : null;
  }
  async findAll2(sortBy: 'DateFin' | 'Prix', order: 'asc' | 'desc') {
    const whereConditions: Prisma.ServiceWhereInput = {};

    const services = await this.prisma.service.findMany({
      where: whereConditions,
      orderBy: [
        {
          [sortBy]: order,
        },
      ],
    });

    console.log('Filtered Services from Backend:', services); // Ajoutez un log pour vérifier les services retournés
    return services;
  }
  async findAllByCategory(categoryId: number): Promise<Service[]> {
    return this.prisma.service.findMany({
      where: {
        categorieId: categoryId,
      },
    });
  }

  async deleteServiceAdmin(id: number, reason: string): Promise<void> {
    const service = await this.prisma.service.findUnique({
      where: { ID: id },
      include: {
        user: true,
      },
    });

    if (!service) {
      throw new NotFoundException(`Service with ID ${id} not found.`);
    }

    try {
      await this.prisma.reservation.deleteMany({
        where: { serviceId: id },
      });

      await this.prisma.review.deleteMany({
        where: { serviceId: id },
      });

      await this.prisma.favoris.deleteMany({
        where: { serviceId: id },
      });

      if (service.Image) {
        await fs.unlink(
          path.join(__dirname, '..', '..', '..', 'uploads', service.Image),
        );
      }
    } catch (error) {
      console.error('Error deleting related records:', error.message);
      throw new Error('Failed to delete related records.');
    }

    try {
      await this.prisma.service.delete({
        where: { ID: id },
      });

      await this.mailerService.sendServiceDeletionEmail(
        service.user.Email,
        service.Titre,
        reason,
      );

      this.eventsGateway.handleDeleteService(service);
    } catch (error) {
      console.error('Error deleting service:', error.message);
      throw new Error('Failed to delete service.');
    }
  }
  async findServicesWithPromotions(): Promise<Service[]> {
    return this.prisma.service.findMany({
      where: {
        promotions: {
          some: {},
        },
      },
    });
  }
}
