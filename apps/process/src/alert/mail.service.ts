import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  setMail(): string {
    console.log('send mail');
    return 'send mail';
  }
}
