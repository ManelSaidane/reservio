import { Injectable, Logger } from '@nestjs/common';
import { google } from 'googleapis';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import * as PDFDocument from 'pdfkit';
import * as fs from 'fs';
import * as path from 'path';
@Injectable()
export class MailerService {
  private readonly logger = new Logger(MailerService.name);
  private transporter: nodemailer.Transporter;

  constructor(private configService: ConfigService) {
    this.initializeTransporter();
  }

  private async initializeTransporter() {
    this.logger.log('Initializing transporter...');
    try {
      const oauth2Client = new google.auth.OAuth2(
        this.configService.get<string>('CLIENT_ID'),
        this.configService.get<string>('CLIENT_SECRET'),
        this.configService.get<string>('REDIRECT_URL'),
      );

      oauth2Client.setCredentials({
        refresh_token: this.configService.get<string>('REFRESH_TOKEN'),
      });

      this.logger.log('Getting access token...');
      const accessToken = await oauth2Client.getAccessToken();
      if (!accessToken) {
        throw new Error('Failed to obtain access token');
      }

      this.logger.log('Access token obtained');

      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          type: 'OAuth2',
          user: this.configService.get<string>('EMAIL_USER'),
          clientId: this.configService.get<string>('CLIENT_ID'),
          clientSecret: this.configService.get<string>('CLIENT_SECRET'),
          refreshToken: this.configService.get<string>('REFRESH_TOKEN'),
          accessToken: accessToken.token,
        },
        logger: true,
        debug: true,
      });

      this.logger.log('Transporter initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize transporter', error.stack);
      throw error;
    }
  }

  async sendMaill(to: string, subject: string, text: string) {
    try {
      const mailOptions = {
        from: this.configService.get<string>('EMAIL_USER'),
        to,
        subject,
        text,
      };

      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email sent to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}`, error.stack);
      throw error;
    }
  }

  async sendPasswordResetEmail(email: string, resetLink: string) {
    const subject = 'Réinitialisation de mot de passe';
    const text = `Bonjour, vous avez demandé une réinitialisation de mot de passe. Veuillez suivre ce lien pour réinitialiser votre mot de passe : ${resetLink}`;

    try {
      await this.sendMaill(email, subject, text);
      this.logger.log(`Password reset email sent to ${email}`);
    } catch (error) {
      this.logger.error(
        `Failed to send password reset email to ${email}`,
        error.stack,
      );
      throw error;
    }
  }

  async sendAdminPaymentNotification(paymentDetails: any) {
    const subject = 'New Payment Received';
    const text = `
      A new payment has been made.
  
      Amount: ${paymentDetails.amount / 100} ${paymentDetails.currency.toUpperCase()}
      Payer Email: ${paymentDetails.email}
  
      Thank you for using our service!
  
      Best regards,
      The Reservio Team
  
      Contact us at: +216 99 043 314
      Visit us at: www.reservio.com
    `;

    try {
      await this.sendMaill('admin@example.com', subject, text);
      this.logger.log('Admin payment notification email sent');
    } catch (error) {
      this.logger.error(
        'Failed to send admin payment notification email',
        error.stack,
      );
      throw error;
    }
  }

  // async sendUserPaymentConfirmation(email: string, paymentDetails: any) {
  //   const subject = 'Payment Successful';
  //   const text = `Your payment was successful.\n\nAmount: ${paymentDetails.amount / 100} ${paymentDetails.currency.toUpperCase()}`;

  //   try {
  //     await this.sendMaill(email, subject, text);
  //     this.logger.log(`User payment confirmation email sent to ${email}`);
  //   } catch (error) {
  //     this.logger.error(
  //       `Failed to send user payment confirmation email to ${email}`,
  //       error.stack,
  //     );
  //     throw error;
  //   }
  // }

  async sendMail(
    to: string,
    subject: string,
    text: string,
    attachments?: any[],
  ) {
    try {
      const mailOptions = {
        from: this.configService.get<string>('EMAIL_USER'),
        to,
        subject,
        text,
        ...(attachments && { attachments }),
      };

      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email sent to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send email to ${to}`, error.stack);
      throw error;
    }
  }
  private ensureDirectoryExists(filePath: string) {
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }
  async sendUserPaymentConfirmation(email: string, paymentDetails: any) {
    const subject = 'Payment Confirmation';
    const text = `
  Dear Customer,
  
  Thank you for your recent payment. We are pleased to confirm that your payment has been successfully processed.
  
  **Invoice Details:**
  
  - **Amount Paid:** ${paymentDetails.amount / 100} ${paymentDetails.currency.toUpperCase()}
  - **Transaction ID:** ${paymentDetails.transactionId || 'N/A'}
  - **Date:** ${new Date().toLocaleDateString()}
  
  If you have any questions or need further assistance, please do not hesitate to contact us.
  
  Best regards,
  
  The Reservio Team
  
  Contact Us:
  +216 99 043 314
  reservio.mailer@gmail.com
  www.reservio.com
  
  This is a computer-generated email and does not require a signature.
    `;

    const invoiceFilePath = path.join(
      __dirname,
      `./invoices/Invoice_${paymentDetails.id}.pdf`,
    );

    try {
      // Ensure the directory exists
      this.ensureDirectoryExists(invoiceFilePath);

      // Generate the PDF invoice
      await this.generateInvoicePdf(paymentDetails, invoiceFilePath);

      // Verify the PDF file exists before sending the email
      if (!fs.existsSync(invoiceFilePath)) {
        throw new Error('Generated PDF file does not exist');
      }

      // Send the email with the invoice attached
      await this.sendMail(email, subject, text, [
        {
          filename: `Invoice_${paymentDetails.id}.pdf`,
          path: invoiceFilePath,
        },
      ]);

      this.logger.log(
        `User payment confirmation email sent to ${email} with invoice attached`,
      );
    } catch (error) {
      this.logger.error(
        `Failed to send user payment confirmation email to ${email}`,
        error.stack,
      );
      throw error;
    }
  }

  // private generateInvoicePdf(paymentDetails: any, filePath: string) {
  //   return new Promise((resolve, reject) => {
  //     const doc = new PDFDocument();
  //     const writeStream = fs.createWriteStream(filePath);

  //     doc.pipe(writeStream);

  //     // Add content to PDF
  //     doc.fontSize(20).text('Invoice', { align: 'center' });
  //     doc.moveDown();
  //     doc
  //       .fontSize(14)
  //       .text(`Invoice Number: INV-${paymentDetails.ID}`, { align: 'left' });
  //     doc.text(`Date: ${new Date().toLocaleDateString()}`, { align: 'left' });
  //     doc.moveDown();
  //     doc.text(`Customer Email: ${paymentDetails.email}`, { align: 'left' });
  //     doc.text(
  //       `Amount Paid: ${paymentDetails.amount / 100} ${paymentDetails.currency.toUpperCase()}`,
  //       { align: 'left' },
  //     );
  //     doc.moveDown();
  //     doc.text('Thank you for your payment!', { align: 'center' });

  //     doc.end();

  //     writeStream.on('finish', () => {
  //       if (fs.existsSync(filePath)) {
  //         this.logger.log(`PDF generated at: ${filePath}`);
  //         resolve(filePath);
  //       } else {
  //         this.logger.error('PDF file does not exist.');
  //         reject(new Error('PDF file was not created.'));
  //       }
  //     });

  //     writeStream.on('error', (error) => {
  //       this.logger.error('Error writing PDF file', error.stack);
  //       reject(error);
  //     });
  //   });
  // }

  private generateInvoicePdf(paymentDetails: any, filePath: string) {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: 'A4', margin: 50 });
      const writeStream = fs.createWriteStream(filePath);

      doc.pipe(writeStream);

      // Header
      doc.fontSize(20).text('Invoice', { align: 'center' });
      doc.moveDown(1);

      //  Information
      doc
        .fontSize(12)
        .text('The Reservio Team', { align: 'center' })
        .text('Contact Us: +216 99 043 314', { align: 'center' })
        .text('Email: reservio.mailer@gmail.com', { align: 'center' })
        .text('Website: www.reservio.com', { align: 'center' });
      doc.moveDown(2);

      // Invoice Details
      doc.fontSize(14).text('Invoice Details', { underline: true });
      doc.moveDown(1);
      doc
        .fontSize(12)
        .text(`Invoice Number: INV-${paymentDetails.id}`, { continued: true })
        .text(`Date: ${new Date().toLocaleDateString()}`, { align: 'right' })
        .moveDown(1)
        .text(`Customer Email: ${paymentDetails.email}`, { continued: true })
        .text(
          `Amount Paid: ${paymentDetails.amount / 100} ${paymentDetails.currency.toUpperCase()}`,
          { align: 'right' },
        );
      doc.moveDown(2);

      doc.fontSize(14).text('Payment Summary', { underline: true });
      doc.moveDown(1);
      doc
        .fontSize(12)
        .text(
          `Amount Paid: ${paymentDetails.amount / 100} ${paymentDetails.currency.toUpperCase()}`,
          { continued: true },
        )
        .text(`Transaction ID: ${paymentDetails.transactionId || 'N/A'}`, {
          align: 'right',
        });

      doc.moveDown(2);

      // Thank You Note
      doc.fontSize(12).text('Thank you for your payment!', { align: 'center' });
      doc.moveDown(2);

      // Footer
      doc
        .fontSize(10)
        .text(
          'This is a computer-generated invoice and does not require a signature.',
          { align: 'center' },
        );

      doc.end();

      writeStream.on('finish', () => {
        if (fs.existsSync(filePath)) {
          this.logger.log(`PDF generated at: ${filePath}`);
          resolve(filePath);
        } else {
          this.logger.error('PDF file does not exist.');
          reject(new Error('PDF file was not created.'));
        }
      });

      writeStream.on('error', (error) => {
        this.logger.error('Error writing PDF file', error.stack);
        reject(error);
      });
    });
  }

  async sendAppointmentReminder(email: string, appointmentDetails: any) {
    const subject = 'Appointment Reminder';
    const text = `
      Hello,
  
      This is a reminder for your upcoming appointment.
  
      **Appointment Details:**
  
      - **Date:** ${appointmentDetails.date}
      - **Time:** ${appointmentDetails.time}
      - **Location:** ${appointmentDetails.location}
      - **Description:** ${appointmentDetails.description || 'N/A'}
  
      If you have any questions or need to reschedule your appointment, please contact us.
  
      Best regards,
  
      The Reservio Team
  
      Contact us:
      +216 99 043 314
      reservio.mailer@gmail.com
      www.reservio.com
  
      This is an automated email and does not require a signature.
    `;

    try {
      const mailOptions = {
        from: this.configService.get<string>('EMAIL_USER'),
        to: email,
        subject,
        text,
      };

      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Appointment reminder sent to ${email}`);
    } catch (error) {
      this.logger.error(
        `Failed to send appointment reminder to ${email}. Error: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
  async sendServiceDeletionEmail(
    serviceProviderEmail: string,
    serviceName: string,
    reason: string,
  ) {
    const subject = `Service Deletion Notification - ${serviceName}`;
    const text = `
  Dear Service Provider,
  
  We regret to inform you that your service titled **"${serviceName}"** has been removed from our platform by the admin.
  
  **Reason for Deletion:** ${reason}
  
  ---
  
  **Please note:** The contents of your service did not comply with our community standards and guidelines. We encourage you to review our [Community Guidelines](https://reservio.com/guidelines) to understand the reasons behind this decision. You are welcome to revise your service and resubmit it for approval.
  
  If you have any questions or concerns, please feel free to contact our support team.
  
  Thank you for your understanding.
  
  Best regards,
  The Reservio Team
  
  Contact Us: +216 99 043 314
  reservio.mailer@gmail.com
  www.reservio.com
    `;

    try {
      const mailOptions = {
        from: this.configService.get<string>('EMAIL_USER'),
        to: serviceProviderEmail,
        subject,
        text,
      };

      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Service deletion email sent to ${serviceProviderEmail}`);
    } catch (error) {
      this.logger.error(
        `Failed to send service deletion email to ${serviceProviderEmail}. Error: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
