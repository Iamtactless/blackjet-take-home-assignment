import express, { Express } from 'express';
import pinoHttp from 'pino-http';

import logger from './logger';

import { errorHandler, errorNotFoundHandler } from '@/middlewares/error-handler';
import { helloWorldRouter } from '@/routes/hello-world';

// Create Express server
export const app: Express = express();

app.use(pinoHttp({ logger: logger }));
// Express configuration
app.set('port', process.env.PORT || 3000);
app.use('/', helloWorldRouter);
app.use(errorNotFoundHandler);
app.use(errorHandler);
