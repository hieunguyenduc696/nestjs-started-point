import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from 'common';
import { AppModule } from 'app.module';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.use(
    cookieSession({
      keys: ['asdfasdf'],
    }),
  );
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  app.useGlobalFilters(new HttpExceptionFilter());
  await app.listen(3000);
}
bootstrap();
