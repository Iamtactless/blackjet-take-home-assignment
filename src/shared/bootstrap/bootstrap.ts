import { INestApplication, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import compression from 'compression';
import helmet from 'helmet';

import { AppModule } from '../../app.module';

export interface BootstrapOptions {
  globalPrefix?: string;
}

export async function bootstrap(options: BootstrapOptions = {}): Promise<void> {
  const logger = new Logger('Bootstrap');

  try {
    const app = await NestFactory.create(AppModule);

    const port = process.env.PORT || 3000;

    if (options.globalPrefix) {
      app.setGlobalPrefix(options.globalPrefix);
    }

    applyMiddleware(app);

    await app.listen(port);

    logger.log(`Application is running on: http://localhost:${port}`);
  } catch (error) {
    logger.error('Error starting server', error);
    process.exit(1);
  }
}

function applyMiddleware(app: INestApplication): void {
  app.use(helmet());
  app.use(compression());

  app.enableCors({
    origin: process.env.CORS_ORIGIN || '*',
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
    credentials: true,
  });
}

export default bootstrap;
