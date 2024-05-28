import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { User } from '@prisma/client';

@Injectable()
export class MailService {
  constructor(private mailer: MailerService, private config: ConfigService) {}

  async sendWelcome(user: User) {
    await this.mailer.sendMail({
      from: 'KahootClone <davidoo1234e@gmail.com>',
      to: user.email,
      subject: 'Welcome to KahootClone!',
      template: './welcome',
      context: {
        username: user.username,
      },
    });
  }

  async sendResetLink(user: User, link: string) {
    await this.mailer.sendMail({
      from: 'KahootClone <davidoo1234e@gmail.com>',
      to: user.email,
      subject: 'Reset password "Kahoot Clone!"',
      template: './reset-password',
      context: {
        username: user.username,
        resetLink: link,
      },
    });
  }
}
