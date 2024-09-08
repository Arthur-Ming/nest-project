import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { AppSettings } from '../../../settings/app-settings';

@Injectable()
export class MailAdapter {
  constructor(
    private readonly mailerService: MailerService,
    private readonly appSettings: AppSettings
  ) {}
  sendMail(listOfReceivers: string[], confirmationCode: string | undefined) {
    this.mailerService
      .sendMail({
        from: `"Arthur 👻" <${this.appSettings.api.EMAIL}>`,
        to: listOfReceivers, // list of receivers
        subject: 'Hello ✔', // Subject line
        html: ` <h1>Thank for your registration</h1>
                <p>To finish registration please follow the link below:
                <a href='https://somesite.com/confirm-email?code=${confirmationCode}'>complete registration</a>
   </p>`,
      })
      .catch(() => {
        console.log('!!');
      });
  }
}
