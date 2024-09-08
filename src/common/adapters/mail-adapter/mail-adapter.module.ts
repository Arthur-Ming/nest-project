import { Module } from '@nestjs/common';
import { appSettings, AppSettings } from '../../../settings/app-settings';
import { MailAdapter } from './mail.adapter';

@Module({
  providers: [
    MailAdapter,
    {
      provide: AppSettings,
      useValue: appSettings,
    },
  ],
  exports: [MailAdapter],
})
export class MailAdapterModule {}
