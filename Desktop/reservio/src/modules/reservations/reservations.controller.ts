import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Req,
  UnauthorizedException,
  Patch,
  Query,
  Logger,
  BadRequestException,
  NotFoundException,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { Reservation, ReservationStatus } from '@prisma/client';
import { RequestWithUser } from 'common/interfaces/RequestWithUser';
import { CreateReservationDto } from './ReservationDTO/CreateReservationDto';
import { ReservationService } from './reservations.service';
import { PrismaModule } from 'prisma/prisma.module';
import { UsersService } from '../users/users.service';
import { PrismaService } from 'prisma/prisma.service';

@Controller('reservation')
export class ReservationController {
  private readonly logger = new Logger(ReservationService.name);
  constructor(
    private readonly reservationService: ReservationService,
    private readonly prisma: PrismaService,
  ) {}

  @Post()
  async create(
    @Body() createReservationDto: CreateReservationDto,
    @Req() req: RequestWithUser,
  ) {
    const userId = req.user?.id;
    if (!userId) {
      throw new UnauthorizedException('User ID is missing.');
    }

    try {
      createReservationDto.userId = userId;
      const reservation =
        await this.reservationService.create(createReservationDto);
      console.log('Réservation reçue :', createReservationDto);
      return reservation;
    } catch (error) {
      throw new UnauthorizedException('Error creating reservation');
    }
  }
  @Get()
  async findAll() {
    return await this.reservationService.findAll();
  }

  @Get('fournisseur')
  async getReservationsByFournisseur(@Req() req: RequestWithUser) {
    const fournisseurId = req.user?.id;
    if (!fournisseurId) {
      throw new UnauthorizedException('User ID is missing.');
    }
    return this.reservationService.getReservationsByFournisseur(fournisseurId);
  }

  @Get('status/:status')
  async getReservationsByStatus(
    @Param('status') status: ReservationStatus,
    @Req() req: RequestWithUser,
  ) {
    const fournisseurId = req.user?.id;
    if (!fournisseurId) {
      throw new UnauthorizedException('User ID is missing.');
    }
    return this.reservationService.getReservationsByStatus(
      fournisseurId,
      status,
    );
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.reservationService.remove(+id);
  }

  // @Patch(':id/accept')
  // async acceptReservation(
  //   @Param('id') id: string,
  //   @Req() req: RequestWithUser,
  // ) {
  //   const fournisseurId = req.user?.id;
  //   if (!fournisseurId) {
  //     throw new UnauthorizedException('User ID is missing.');
  //   }
  //   return await this.reservationService.updateReservationStatus(
  //     parseInt(id),
  //     ReservationStatus.ACCEPTED,
  //   );
  // }
  @Patch(':id/accept')
  async acceptReservation(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
  ) {
    const fournisseurId = req.user?.id;

    if (!fournisseurId) {
      throw new UnauthorizedException('User ID is missing.');
    }

    try {
      // Appelez le service pour mettre à jour le statut de la réservation
      return await this.reservationService.updateReservationStatus(
        parseInt(id),
        ReservationStatus.ACCEPTED,
        fournisseurId,
      );
    } catch (error) {
      throw new UnauthorizedException('Failed to accept reservation.');
    }
  }
  @Post(':id/accept')
  async acceptReserva(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
  ): Promise<void> {
    const userId = req.user.id;
    await this.reservationService.acceptReservation(+id, userId);
  }

  @Post(':id/reject')
  async rejectReserva(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
  ): Promise<void> {
    const userId = req.user.id;
    await this.reservationService.rejectReservation(+id, userId);
  }
  // @Patch(':id/reject')
  // async rejectReservation(
  //   @Param('id') id: string,
  //   @Req() req: RequestWithUser,
  // ) {
  //   const fournisseurId = req.user?.id;
  //   if (!fournisseurId) {
  //     throw new UnauthorizedException('User ID is missing.');
  //   }
  //   return await this.reservationService.updateReservationStatus(
  //     parseInt(id),
  //     ReservationStatus.REJECTED,
  //   );
  // }
  @Patch(':id/reject')
  async rejectReservation(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
  ) {
    const fournisseurId = req.user?.id;

    if (!fournisseurId) {
      throw new UnauthorizedException('User ID is missing.');
    }

    try {
      // Appelez le service pour mettre à jour le statut de la réservation
      return await this.reservationService.updateReservationStatus(
        parseInt(id),
        ReservationStatus.REJECTED,
        fournisseurId,
      );
    } catch (error) {
      throw new UnauthorizedException('Failed to reject reservation.');
    }
  }
  @Get('client')
  async getClientReservations(@Req() request: RequestWithUser) {
    const userId = request.user.id;

    return await this.reservationService.getReservationsByUserId(userId);
  }

  @Get('statistics')
  async getStatistics(@Req() req: RequestWithUser) {
    const fournisseurId = req.user?.id;
    if (!fournisseurId) {
      throw new UnauthorizedException('User ID is missing.');
    }
    return this.reservationService.getStatistics(fournisseurId);
  }

  @Get('pending')
  async getPendingReservations(
    @Query('page') page: number,
    @Req() req: RequestWithUser,
  ) {
    const fournisseurId = req.user?.id;
    if (!fournisseurId) {
      throw new UnauthorizedException('User ID is missing.');
    }
    return this.reservationService.getPendingReservations(fournisseurId, page);
  }

  @Get('accepted')
  async getAcceptedReservations(
    @Query('page') page: number,
    @Req() req: RequestWithUser,
  ) {
    const fournisseurId = req.user?.id;
    if (!fournisseurId) {
      throw new UnauthorizedException('User ID is missing.');
    }
    return this.reservationService.getAcceptedReservations(fournisseurId, page);
  }
  @Patch('cancel/:id')
  async cancelReservation(
    @Param('id') reservationId: number,
    @Req() request: RequestWithUser,
  ): Promise<string> {
    try {
      const user = request.user;

      if (!user || !user.id) {
        throw new BadRequestException('User not authenticated');
      }

      await this.reservationService.cancelReservation(reservationId, user.id);

      return 'Reservation successfully canceled';
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(
          `Failed to cancel reservation: ${error.message}`,
        );
      } else if (error instanceof NotFoundException) {
        throw new NotFoundException(`Reservation not found: ${error.message}`);
      } else {
        throw new BadRequestException(`Unexpected error: ${error.message}`);
      }
    }
  }

  @Get(':userId/accepted-rejected')
  async getAcceptedAndRejectedReservations(
    @Param('id') id: string,
    @Req() req: RequestWithUser,
  ): Promise<Reservation[]> {
    const userId = req.user?.id;
    return this.reservationService.getAcceptedAndRejectedReservations(+userId);
  }

  @Get(':userId/pending')
  async getPendingReservationss(
    @Param('userId') userId: string,
    @Req() req: RequestWithUser,
  ): Promise<Reservation[]> {
    const id = req.user?.id;
    return this.reservationService.getPendingReservationss(+id);
  }

  @Post('forgot-password')
  async forgotPassword(@Body('email') email: string) {
    this.logger.log(`Forgot password requested for email: ${email}`);
    return this.reservationService.forgotPassword(email);
  }

  @Post('reset-password/:token')
  async resetPassword(
    @Param('token') token: string,
    @Body('newPassword') newPassword: string,
  ) {
    return this.reservationService.resetPassword(token, newPassword);
  }
  @Post('send-reminders')
  async sendReminders() {
    try {
      await this.reservationService.sendReminderForUpcomingReservations();
      return { message: 'Reminders sent successfully' };
    } catch (error) {
      return { message: 'Failed to send reminders', error: error.message };
    }
  }
  @Get('user/validation-status')
  async getUserValidationStatus(@Req() req: RequestWithUser) {
    const user = await this.prisma.user.findUnique({
      where: { ID: req.user.id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return { isValidated: user.Validation };
  }
}
