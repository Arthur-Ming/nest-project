import { Test, TestingModuleBuilder } from '@nestjs/testing';
import { AppModule } from '../../src/app.module';
import { appSettings } from '../../src/settings/app-settings';
import { applyAppSettings } from '../../src/settings/apply-app-setting';

export const initSettings = async (
  addSettingsToModuleBuilder?: (moduleBuilder: TestingModuleBuilder) => void
) => {
  console.log('in tests ENV: ', appSettings.env.getEnv());
  const testingModuleBuilder: TestingModuleBuilder = Test.createTestingModule({
    imports: [AppModule],
  });

  if (addSettingsToModuleBuilder) {
    addSettingsToModuleBuilder(testingModuleBuilder);
  }

  const testingAppModule = await testingModuleBuilder.compile();

  const app = testingAppModule.createNestApplication();

  applyAppSettings(app);

  await app.init();

  const httpServer = app.getHttpServer();

  // const req = agent(app.getHttpServer());

  return {
    app,
    httpServer,
    // req,
  };
};
