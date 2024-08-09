import { BadRequestException, INestApplication, ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from '../utils/http-exception.filter';
import { useContainer } from 'class-validator';
import { AppModule } from '../app.module';

export const applyAppSettings = (app: INestApplication) => {
  app.enableCors();
  useContainer(app.select(AppModule), { fallbackOnErrors: true });
  setAppPipes(app);
  app.useGlobalFilters(new HttpExceptionFilter());
};

const setAppPipes = (app: INestApplication) => {
  app.useGlobalPipes(
    new ValidationPipe({
      stopAtFirstError: true,
      exceptionFactory: (errors) => {
        const customErrors = {
          errorsMessages: [],
        };
        errors.forEach((error) => {
          const errorConstraintValues = Object.values(error.constraints as Record<string, string>);

          const [message] = errorConstraintValues;
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          //@ts-expect-error
          customErrors.errorsMessages.push({ field: error.property, message });
        });

        throw new BadRequestException(customErrors);
      },
    })
  );
};
