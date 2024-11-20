import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { MailerService } from 'common/interfaces/mail.service';
import { Reservation, ReservationStatus, User } from '@prisma/client';
import { CreateReservationDto } from './ReservationDTO/CreateReservationDto';
import { NotificationsService } from '../notifications/notifications.service';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { Cron } from '@nestjs/schedule';
import * as moment from 'moment';
import { UsersService } from '../users/users.service';
@Injectable()
export class ReservationService {
  private readonly logger = new Logger(ReservationService.name);
  private readonly FRONTEND_URL = 'http://localhost:5173';
  private readonly reminderHours = 24;
  constructor(
    private prisma: PrismaService,
    private mailerService: MailerService,
    private notificationsService: NotificationsService,
    private usersService: UsersService,
  ) {}

  async create(createReservationDto: CreateReservationDto) {
    // try {
    //   const date = new Date(createReservationDto.Date);

    //   const reservation = await this.prisma.reservation.create({
    //     data: {
    //       serviceId: createReservationDto.serviceId,
    //       DATE: date.toISOString(),
    //       userId: createReservationDto.userId,
    //       statut: ReservationStatus.PENDING,
    //     },
    //   });
    try {
      // Convertir la date en ISO
      const dateDeb = new Date(createReservationDto.DateDebut);
      if (isNaN(dateDeb.getTime())) {
        throw new Error('Invalid date format');
      }
      const datefin = new Date(createReservationDto.DateFin);
      if (isNaN(datefin.getTime())) {
        throw new Error('Invalid date format');
      }

      const reservation = await this.prisma.reservation.create({
        data: {
          serviceId: createReservationDto.serviceId,
          DateDebut: dateDeb.toISOString(),
          DateFin: datefin.toISOString(),
          userId: createReservationDto.userId,
          statut: ReservationStatus.PENDING,
        },
      });

      const service = await this.prisma.service.findFirst({
        where: { ID: createReservationDto.serviceId },
        include: { user: true },
      });

      if (service && service.user) {
        const subject = 'Nouvelle demande de réservation';
        const text = `Vous avez une nouvelle demande de réservation pour le service ${service.Titre} à la date ${createReservationDto.DateDebut} jusqu à  ${createReservationDto.DateFin}.`;

        await this.mailerService.sendMaill(service.user.Email, subject, text);
        this.logger.log(`Email sent to ${service.user.Email}`);
      } else {
        this.logger.warn(
          `Service with ID ${createReservationDto.serviceId} or its user not found`,
        );
      }

      return reservation;
    } catch (error) {
      this.logger.error('Error creating reservation', error.stack);
      throw error;
    }
  }

  async findAll() {
    return await this.prisma.reservation.findMany();
  }

  async remove(id: number) {
    return await this.prisma.reservation.delete({
      where: {
        ID: id,
      },
    });
  }

  async findUserById(userId: number): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { ID: userId } });
  }

  async getReservationsByFournisseur(fournisseurId: number) {
    return this.prisma.reservation.findMany({
      where: {
        service: {
          userId: fournisseurId,
        },
      },
      include: {
        user: true,
        service: true,
      },
    });
  }

  async getReservationsByStatus(
    fournisseurId: number,
    status: ReservationStatus,
  ) {
    return this.prisma.reservation.findMany({
      where: {
        service: {
          userId: fournisseurId,
        },
        statut: status,
      },
      include: {
        user: true,
        service: true,
      },
    });
  }

  async updateReservationStatus(
    reservationId: number,
    status: ReservationStatus,
    userId: number,
  ) {
    const isValidated = await this.isUserValidated(userId);
    if (!isValidated) {
      this.logger.error(`Account is blocked for user: ${userId}`);
      throw new UnauthorizedException(
        "Account is blocked, you didn't pay this month",
      );
    }
    try {
      const reservation = await this.prisma.reservation.update({
        where: { ID: reservationId },
        data: { statut: status },
      });

      const client = await this.prisma.user.findUnique({
        where: { ID: reservation.userId },
      });

      if (client) {
        const subject = 'Mise à jour de votre réservation';
        const text = `Votre réservation pour le service avec ID ${reservation.serviceId} a été ${status.toLowerCase()}.`;

        await this.mailerService.sendMaill(client.Email, subject, text);
        this.logger.log(`Email sent to ${client.Email}`);
      } else {
        this.logger.warn(`Client with ID ${reservation.userId} not found`);
      }

      return reservation;
    } catch (error) {
      this.logger.error('Error updating reservation status', error.stack);
      throw error;
    }
  }

  async getReservationsByUserId(userId: number) {
    return await this.prisma.reservation.findMany({
      where: {
        userId: userId,
      },
      include: {
        service: true,
      },
    });
  }
  // async acceptReservation(
  //   reservationId: number,
  //   userId: number,
  // ): Promise<void> {
  //   // Vérifiez si l'utilisateur est validé
  //   const isUserValidated = await this.isUserValidated(userId);
  //   if (!isUserValidated) {
  //     throw new ForbiddenException(
  //       'User is not validated and cannot manage reservations.',
  //     );
  //   }
  //   try {
  //     await this.prisma.reservation.update({
  //       where: { ID: reservationId },
  //       data: { statut: 'ACCEPTED' },
  //     });

  //     // Créez une notification pour l'utilisateur
  //     await this.notificationsService.createForUser(
  //       userId,
  //       'Votre demande de réservation a été acceptée.',
  //     );
  //   } catch (error) {
  //     // Gérer les erreurs
  //     throw new Error(`Could not accept reservation: ${error.message}`);
  //   }
  // }
  async acceptReservation(
    reservationId: number,
    userId: number,
  ): Promise<void> {
    // Vérifiez si l'utilisateur est validé
    const isUserValidated = await this.isUserValidated(userId);
    if (!isUserValidated) {
      throw new ForbiddenException(
        'User is not validated and cannot manage reservations.',
      );
    }

    // Fetch the reservation to check its current status
    const reservation = await this.prisma.reservation.findUnique({
      where: { ID: reservationId },
    });

    if (!reservation) {
      throw new NotFoundException('Reservation not found.');
    }

    if (reservation.statut !== ReservationStatus.PENDING) {
      throw new BadRequestException(
        'Only pending reservations can be accepted.',
      );
    }

    try {
      await this.prisma.reservation.update({
        where: { ID: reservationId },
        data: { statut: 'ACCEPTED' },
      });

      // Créez une notification pour l'utilisateur
      await this.notificationsService.createForUser(
        userId,
        'Votre demande de réservation a été acceptée.',
      );
    } catch (error) {
      throw new Error(`Could not accept reservation: ${error.message}`);
    }
  }

  async cancelReservation(
    reservationId: number,
    userId: number,
  ): Promise<void> {
    try {
      const reservation = await this.prisma.reservation.findUnique({
        where: { ID: reservationId },
        include: { service: { include: { user: true } } },
      });

      if (!reservation) {
        throw new NotFoundException('Reservation not found');
      }

      if (reservation.userId !== userId) {
        throw new BadRequestException('Unauthorized action');
      }

      if (reservation.statut !== ReservationStatus.ACCEPTED) {
        throw new BadRequestException(
          'Only accepted reservations can be canceled',
        );
      }

      // Mise à jour du statut de la réservation
      await this.prisma.reservation.update({
        where: { ID: reservationId },
        data: { statut: ReservationStatus.CANCELED },
      });

      // Envoi d'un email au fournisseur
      const supplierEmail = reservation.service.user.Email;
      const subject = "Confirmation d'annulation de réservation";
      const text = `La réservation pour le service ${reservation.service.Titre} a été annulée par le client.`;

      await this.mailerService.sendMaill(supplierEmail, subject, text);
      this.logger.log(`Email sent to supplier ${supplierEmail}`);

      // Optionnel : Créer une notification pour l'utilisateur
      await this.notificationsService.createForUser(
        userId,
        'Votre réservation a été annulée avec succès.',
      );
    } catch (error) {
      this.logger.error('Error canceling reservation', error.stack);
      throw new Error(`Could not cancel reservation: ${error.message}`);
    }
  }

  async rejectReservation(
    reservationId: number,
    userId: number,
  ): Promise<void> {
    try {
      await this.prisma.reservation.update({
        where: { ID: reservationId },
        data: { statut: 'REJECTED' },
      });

      // Créez une notification pour l'utilisateur
      await this.notificationsService.createForUser(
        userId,
        'Votre demande de réservation a été refusée.',
      );
    } catch (error) {
      throw new Error(`Could not reject reservation: ${error.message}`);
    }
  }

  async getStatistics(fournisseurId: number) {
    const totalDemands = await this.prisma.reservation.count({
      where: {
        service: {
          userId: fournisseurId,
        },
      },
    });
    const acceptedDemands = await this.prisma.reservation.count({
      where: {
        service: {
          userId: fournisseurId,
        },
        statut: ReservationStatus.ACCEPTED,
      },
    });
    const rejectedDemands = await this.prisma.reservation.count({
      where: {
        service: {
          userId: fournisseurId,
        },
        statut: ReservationStatus.REJECTED,
      },
    });
    const totalRevenue = await this.prisma.reservation.findMany({
      where: {
        service: {
          userId: fournisseurId,
        },
        statut: ReservationStatus.ACCEPTED,
      },
      select: {
        service: {
          select: {
            Prix: true,
          },
        },
      },
    });
    const revenueSum = totalRevenue.reduce(
      (acc, reservation) => acc + (reservation.service?.Prix || 0),
      0,
    );
    // const revenueSum = totalRevenue.reduce(
    //   (acc, reservation) => acc + (reservation.serviceId?.Prix || 0),
    //   0,
    // );

    return {
      totalDemands,
      acceptedDemands,
      rejectedDemands,
      totalRevenue: revenueSum,
    };
  }

  async getPendingReservations(fournisseurId: number, page: number = 1) {
    const pageSize = 10;
    const skip = (page - 1) * pageSize;
    const reservations = await this.prisma.reservation.findMany({
      where: {
        service: {
          userId: fournisseurId,
        },
        statut: ReservationStatus.PENDING,
      },
      skip,
      take: pageSize,
    });
    const totalReservations = await this.prisma.reservation.count({
      where: {
        service: {
          userId: fournisseurId,
        },
        statut: ReservationStatus.PENDING,
      },
    });
    const totalPages = Math.ceil(totalReservations / pageSize);

    return { reservations, totalPages };
  }

  async getAcceptedReservations(fournisseurId: number, page: number = 1) {
    const pageSize = 10;
    const skip = (page - 1) * pageSize;
    const reservations = await this.prisma.reservation.findMany({
      where: {
        service: {
          userId: fournisseurId,
        },
        statut: ReservationStatus.ACCEPTED,
      },
      skip,
      take: pageSize,
    });
    const totalReservations = await this.prisma.reservation.count({
      where: {
        service: {
          userId: fournisseurId,
        },
        statut: ReservationStatus.ACCEPTED,
      },
    });
    const totalPages = Math.ceil(totalReservations / pageSize);

    return { reservations, totalPages };
  }

  // async getAcceptedAndRejectedReservations(
  //   userId: number,
  // ): Promise<Reservation[]> {
  //   try {
  //     const reservations = await this.prisma.reservation.findMany({
  //       where: {
  //         userId: userId,
  //         statut: {
  //           in: [ReservationStatus.ACCEPTED, ReservationStatus.REJECTED],
  //         },
  //       },
  //       include: {
  //         service: true,
  //       },
  //     });
  //     return reservations;
  //   } catch (error) {
  //     throw new Error(`Failed to fetch reservations: ${error.message}`);
  //   }
  // }
  async getAcceptedAndRejectedReservations(userId: number) {
    return this.prisma.reservation.findMany({
      where: {
        userId: userId,
        statut: {
          in: [ReservationStatus.ACCEPTED, ReservationStatus.REJECTED],
        },
      },
      include: {
        service: {
          include: {
            user: {
              select: {
                Nom: true,
                Num: true,
                Email: true,
              },
            },
          },
        },
      },
    });
  }

  async getPendingReservationss(userId: number): Promise<Reservation[]> {
    return this.prisma.reservation.findMany({
      where: {
        userId,
        statut: 'PENDING',
      },
      include: {
        service: true,
      },
    });
  }

  async forgotPassword(email: string) {
    try {
      const user = await this.prisma.user.findUnique({
        where: { Email: email },
      });
      if (!user) {
        throw new BadRequestException('User not found');
      }

      const resetToken = this.generateResetToken();
      const resetTokenExpiry = moment().add(1, 'hour').toDate();

      await this.saveResetToken(user.ID, resetToken, resetTokenExpiry);

      const resetLink = `${this.FRONTEND_URL}/reset-password/${resetToken}`;
      await this.mailerService.sendPasswordResetEmail(email, resetLink);

      return { message: 'Password reset email sent' };
    } catch (error) {
      throw new Error(`Failed to send password reset email: ${error.message}`);
    }
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      const user = await this.findByResetToken(token);

      if (!user) {
        throw new BadRequestException('Invalid or expired reset token');
      }

      if (moment().isAfter(user.resetTokenExpiry)) {
        throw new BadRequestException('Reset token has expired');
      }

      const hashedPassword = await this.hashPassword(newPassword);
      await this.updatePassword(user.ID, hashedPassword);
      await this.saveResetToken(user.ID, null, null);

      return { message: 'Password successfully reset' };
    } catch (error) {
      throw new Error(`Failed to reset password: ${error.message}`);
    }
  }

  private generateResetToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  async saveResetToken(
    userId: number,
    resetToken: string | null,
    resetTokenExpiry: Date | null,
  ) {
    return this.prisma.user.update({
      where: { ID: userId },
      data: { resetToken, resetTokenExpiry },
    });
  }

  async findByResetToken(token: string) {
    return this.prisma.user.findFirst({
      where: { resetToken: token },
    });
  }

  async updatePassword(userId: number, hashedPassword: string) {
    return this.prisma.user.update({
      where: { ID: userId },
      data: { MotDePasse: hashedPassword },
    });
  }

  async hashPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
  }

  async sendReminderForSpecificReservation(reservationId: number) {
    try {
      const reservation = await this.prisma.reservation.findUnique({
        where: {
          ID: reservationId,
        },
        include: {
          service: {
            include: {
              user: true,
            },
          },
          user: true,
        },
      });

      if (!reservation || reservation.statut !== ReservationStatus.ACCEPTED) {
        throw new BadRequestException('Reservation not found or not accepted');
      }

      const supplierEmail = reservation.service.user.Email;
      const clientName = reservation.user.Nom;
      const serviceTitle = reservation.service.Titre;
      const reservationDate = reservation.DateDebut;

      const subject = 'Rappel de rendez-vous';
      const text = `Cher(e) fournisseur, \n\n Ceci est un rappel pour votre réservation acceptée avec ${clientName} pour le service "${serviceTitle}" prévu le ${reservationDate}. \n\n Merci de vérifier votre agenda et d'être prêt pour le rendez-vous. \n\n Cordialement, \n L'équipe de gestion des réservations`;

      await this.mailerService.sendMaill(supplierEmail, subject, text);
      this.logger.log(`Reminder email sent to ${supplierEmail}`);
    } catch (error) {
      this.logger.error('Error sending reminder email', error.stack);
    }
  }

  // async sendReminderForUpcomingReservations() {
  //   const now = new Date();
  //   const reminderTime = new Date(now.getTime() + 24 * 60 * 60 * 1000); // Rappel pour les réservations dans 24 heures

  //   try {
  //     const upcomingReservations = await this.prisma.reservation.findMany({
  //       where: {
  //         DateDebut: {
  //           lte: reminderTime.toISOString(),
  //           gt: now.toISOString(),
  //         },
  //         statut: ReservationStatus.ACCEPTED,
  //       },
  //       include: {
  //         service: {
  //           include: {
  //             user: true, // Fournisseur
  //           },
  //         },
  //         user: true, // Client
  //       },
  //     });

  //     for (const reservation of upcomingReservations) {
  //       const email = reservation.user.Email;
  //       const appointmentDetails = {
  //         date: reservation.DateDebut,
  //         time: reservation.DateDebut,
  //         location: reservation.service.Place || 'N/A',
  //         description: reservation.service.Description || 'N/A',
  //       };

  //       await this.mailerService.sendAppointmentReminder(
  //         email,
  //         appointmentDetails,
  //       );
  //       this.logger.log(`Rappel de rendez-vous envoyé à ${email}`);
  //     }
  //   } catch (error) {
  //     this.logger.error(
  //       'Failed to send reminders for upcoming reservations',
  //       error.stack,
  //     );
  //     throw error;
  //   }
  // }
  @Cron('0 0 * * *') // Exécuter tous les jours à minuit
  async handleCron() {
    this.logger.log('Running scheduled task to send reminders');
    await this.sendReminderForUpcomingReservations();
  }

  async sendReminderForUpcomingReservations() {
    const now = new Date();
    const reminderTime = new Date(now.getTime() + 24 * 60 * 60 * 1000); // Reminder for reservations in 24 hours

    try {
      // Fetch upcoming reservations that are accepted and start within 24 hours
      const upcomingReservations = await this.prisma.reservation.findMany({
        where: {
          DateDebut: {
            lte: reminderTime.toISOString(),
            gt: now.toISOString(),
          },
          statut: ReservationStatus.ACCEPTED,
        },
        include: {
          service: {
            include: {
              user: true, // Service provider
            },
          },
          user: true, // Client
        },
      });

      this.logger.log(
        `Found ${upcomingReservations.length} upcoming reservations`,
      );

      for (const reservation of upcomingReservations) {
        const email = reservation.user.Email;
        const appointmentDetails = {
          date: reservation.DateDebut,
          time: reservation.DateDebut,
          location: reservation.service.Place || 'N/A',
          description: reservation.service.Description || 'N/A',
        };

        this.logger.log(
          `Sending reminder to ${email} with details: ${JSON.stringify(appointmentDetails)}`,
        );

        try {
          await this.mailerService.sendAppointmentReminder(
            email,
            appointmentDetails,
          );
          this.logger.log(`Appointment reminder sent to ${email}`);
        } catch (error) {
          this.logger.error(
            `Failed to send reminder to ${email}. Error: ${error.message}`,
            error.stack,
          );
        }
      }
    } catch (error) {
      this.logger.error(
        'Failed to send reminders for upcoming reservations',
        error.stack,
      );
      throw error;
    }
  }

  async isUserValidated(userId: number): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { ID: userId },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found`);
    }

    // Retourne true si l'utilisateur est validé, sinon false
    return user.Validation;
  }
}
