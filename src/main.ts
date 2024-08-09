import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { applyAppSettings } from './settings/apply-app-setting';
import { appSettings } from './settings/app-settings';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  applyAppSettings(app);

  await app.listen(appSettings.port, () => {
    console.log('App starting listen port: ', appSettings.port);
  });
}
bootstrap();
