// import {
//   Controller,
//   Get,
//   Post,
//   Body,
//   Param,
//   Delete,
//   Put,
//   Req,
//   UnauthorizedException,
//   UseInterceptors,
//   UploadedFile,
//   NotFoundException,
// } from '@nestjs/common';
// import { ServicesService } from './services.service';
// import { Service as ServiceModel } from '@prisma/client';
// import { RequestWithUser } from 'common/interfaces/RequestWithUser';
// import { CreateServiceDto } from './service dto/create-service.dto';
// import { UpdateServiceDto } from './service dto/update-service.dto';
// import { FileInterceptor } from '@nestjs/platform-express';
// import { CategoriesService } from '../categories/categories.service'; // Importez le service de catégories

// @Controller('services')
// export class ServicesController {
//   constructor(
//     private readonly servicesService: ServicesService,
//     private readonly categoriesService: CategoriesService,
//   ) {}

//   // @Post()
//   // @UseInterceptors(FileInterceptor('image'))
//   // async create(
//   //   @Body() createServiceDto: CreateServiceDto,
//   //   @UploadedFile() file: Express.Multer.File,
//   //   @Req() req: RequestWithUser,
//   // ): Promise<any> {
//   //   const userId = req.user?.id;
//   //   if (!userId) {
//   //     throw new UnauthorizedException('User ID is missing.');
//   //   }

//   //   // Vérifiez que l'utilisateur est un fournisseur de services
//   //   const user = await this.servicesService.findUserById(userId);
//   //   if (!user || user.Role !== 'SERVICE_PROVIDER') {
//   //     throw new UnauthorizedException(
//   //       'Only service providers can create services.',
//   //     );
//   //   }

//   //   // Récupérez toutes les catégories disponibles
//   //   const categories = await this.categoriesService.findAll();

//   //   // // Trouvez la catégorie sélectionnée par son nom dans le DTO
//   //   // const selectedCategory = categories.find(
//   //   //   (cat) => cat.name === createServiceDto.categoryName,
//   //   // );

//   //   // if (!selectedCategory) {
//   //   //   throw new Error('Selected category not found.');
//   //   // }

//   //   // Affectez l'ID de la catégorie au DTO de création du service
//   //   createServiceDto.userId = userId;
//   //   // createServiceDto.categorieId = selectedCategory.ID;
//   //   // if (!createServiceDto.categorieId) {
//   //   //   console.log('l id de categorie manque!!! ');
//   //   //   throw new UnauthorizedException('l id de categorie manque!!! ');
//   //   // }
//   //   // Créez le service en utilisant le service approprié
//   //   const createdService = await this.servicesService.create(
//   //     createServiceDto,
//   //     file,
//   //   );

//   //   return createdService;
//   // }

//   @Post()
//   @UseInterceptors(FileInterceptor('image'))
//   async create(
//     @Body() createServiceDto: CreateServiceDto,
//     @UploadedFile() file: Express.Multer.File,
//     @Req() req: RequestWithUser,
//   ): Promise<any> {
//     const userId = req.user?.id;
//     if (!userId) {
//       throw new UnauthorizedException('User ID is missing.');
//     }

//     const user = await this.servicesService.findUserById(userId);
//     if (!user || user.Role !== 'SERVICE_PROVIDER') {
//       throw new UnauthorizedException(
//         'Only service providers can create services.',
//       );
//     }

//     createServiceDto.userId = userId;

//     const createdService = await this.servicesService.create(
//       createServiceDto,
//       file,
//     );

//     return createdService;
//   }

//   @Get()
//   findAll(): Promise<ServiceModel[]> {
//     return this.servicesService.findAll();
//   }

//   @Get(':id')
//   findOne(@Param('id') id: string): Promise<ServiceModel> {
//     return this.servicesService.findOne(+id);
//   }

//   @Put(':id')
//   @UseInterceptors(FileInterceptor('image'))
//   async update(
//     @Param('id') id: string,
//     @Body() updateServiceDto: UpdateServiceDto,
//     @UploadedFile() file: Express.Multer.File,
//     @Req() req: RequestWithUser, // Utilisation de l'interface RequestWithUser pour accéder à req.user
//   ): Promise<ServiceModel> {
//     const userId = req.user?.id; // Récupération de l'userId à partir de req.user
//     if (!userId) {
//       throw new UnauthorizedException('User ID is missing.');
//     }

//     // Vérifier que l'utilisateur est autorisé à mettre à jour ce service (ajoutez votre logique d'autorisation ici si nécessaire)

//     // Appel au service pour effectuer la mise à jour
//     return this.servicesService.update(+id, updateServiceDto, file);
//   }

//   @Delete(':id')
//   async deleteService(@Param('id') id: string): Promise<void> {
//     try {
//       await this.servicesService.deleteService(parseInt(id, 10));
//     } catch (error) {
//       if (error instanceof NotFoundException) {
//         throw new NotFoundException(error.message);
//       }
//       // Gérer d'autres erreurs ici si nécessaire
//       throw error;
//     }
//   }
//   // @Delete(':id')
//   // remove(
//   //   @Param('id') id: string,
//   //   @Req() req: RequestWithUser,
//   // ): Promise<ServiceModel> {
//   //   const userId = req.user?.id;
//   //   if (!userId) {
//   //     throw new UnauthorizedException('User ID is missing.');
//   //   }

//   //   return this.servicesService.remove(+id);
//   // }
// }

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Req,
  UnauthorizedException,
  UseInterceptors,
  UploadedFile,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { Service, Service as ServiceModel, User } from '@prisma/client';
import { RequestWithUser } from 'common/interfaces/RequestWithUser';
import { CreateServiceDto } from './service dto/create-service.dto';
import { UpdateServiceDto } from './service dto/update-service.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { CategoriesService } from '../categories/categories.service'; // Importez le service de catégories
import { UsersService } from '../users/users.service';

@Controller('services')
export class ServicesController {
  constructor(
    private readonly servicesService: ServicesService,
    private readonly categoriesService: CategoriesService,
    private readonly userService: UsersService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('image'))
  async create(
    @Body() createServiceDto: CreateServiceDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: RequestWithUser,
  ): Promise<any> {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedException("L'ID utilisateur est manquant.");
    }

    const user = await this.servicesService.findUserById(userId);
    if (!user || user.Role !== 'SERVICE_PROVIDER') {
      throw new UnauthorizedException(
        'Seuls les fournisseurs de services peuvent créer des services.',
      );
    }

    createServiceDto.userId = userId;

    const createdService = await this.servicesService.create(
      createServiceDto,
      file,
    );

    return createdService;
  }

  @Get()
  findAll(): Promise<ServiceModel[]> {
    return this.servicesService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string): Promise<ServiceModel> {
  //   return this.servicesService.findOne(+id);
  // }

  @Put(':id')
  @UseInterceptors(FileInterceptor('image'))
  async update(
    @Param('id') id: string,
    @Body() updateServiceDto: UpdateServiceDto,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: RequestWithUser,
  ): Promise<ServiceModel> {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedException("L'ID utilisateur est manquant.");
    }

    return this.servicesService.update(+id, updateServiceDto, file);
  }

  @Delete(':id')
  async deleteService(@Param('id') id: string): Promise<void> {
    try {
      await this.servicesService.deleteService(parseInt(id, 10));
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }
  @Get('userCount')
  async getUserCount(): Promise<number> {
    return this.servicesService.getUserCount();
  }
  @Get('service-provider-count')
  async getServiceProviderCount() {
    return {
      serviceProviderCount:
        await this.servicesService.getServiceProviderCount(),
    };
  }

  @Get('client-count')
  async getClientCount() {
    return {
      clientCount: await this.servicesService.getClientCount(),
    };
  }
  @Get('serviceCount')
  async getServiceCount(): Promise<number> {
    return this.servicesService.getServiceCount();
  }

  @Get('reservationCount')
  async getReservationCount(): Promise<number> {
    return this.servicesService.getReservationCount();
  }

  @Get('latest-signups')
  async getLatestSignups(): Promise<User[]> {
    try {
      return this.servicesService.findLatestSignups(5);
    } catch (error) {
      console.error('Error fetching latest signups:', error);
      throw new Error('Failed to fetch latest signups');
    }
  }

  @Get('/user/:userId')
  async getServicesByUserId(@Param('userId') userId: number) {
    const services = await this.servicesService.findServicesByUserId(userId);
    if (!services.length) {
      throw new NotFoundException(
        `No services found for user with ID ${userId}`,
      );
    }
    return services;
  }

  @Get('tri')
  async findAll2(
    @Query('sortBy') sortBy: 'DateFin' | 'Prix',
    @Query('order') order: 'asc' | 'desc',
  ) {
    try {
      const services = await this.servicesService.findAll2(
        sortBy,
        order,
        // numericCategoryId,
      );
      return services;
    } catch (error) {
      throw new Error(`Failed to fetch services: ${error.message}`);
    }
  }
  @Get('category/:id')
  async getByCategory(@Param('id') id: number) {
    return this.servicesService.findAllByCategory(id);
  }

  @Delete('admin/:id')
  async deleteServiceAdmin(
    @Param('id') id: string,
    @Body('reason') reason: string,
    @Req() request: RequestWithUser,
  ): Promise<void> {
    const user = request.user;

    try {
      await this.servicesService.deleteServiceAdmin(
        parseInt(id, 10),
        'You are sharing something thats not legal',
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`Service with ID ${id} not found.`);
      }
      throw new Error('Failed to delete service.');
    }
  }
  @Get('with-promotions')
  async getServicesWithPromotions(): Promise<Service[]> {
    return this.servicesService.findServicesWithPromotions();
  }
}
