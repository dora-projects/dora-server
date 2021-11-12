import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(private configService: ConfigService) {}

  detectTransport() {
    const host = this.configService.get<string>('email.host');
    const port = this.configService.get<number>('email.port');
    const user = this.configService.get<string>('email.user');
    const pass = this.configService.get<string>('email.pass');

    if (process.env.emailHost) {
      return {
        host,
        port,
        auth: { user, pass },
        secure: port === 465,
      };
    }

    return {
      sendmail: true,
      newline: 'unix',
      path: '/usr/sbin/sendmail',
    };
  }

  async sendEmail({ from, to, subject, text, html = null }): Promise<any> {
    return new Promise((resolve, reject) => {
      if (!to || !subject || (!text && !html)) {
        return reject('Missing required args to send email.');
      }

      const content = {
        from,
        to,
        subject,
        text,
        html,
      };

      const transport = this.detectTransport();
      nodemailer.createTransport(transport).sendMail(content, (error, info) => {
        if (error) {
          return reject(error.message);
        }
        return resolve(info);
      });
    });
  }
}
