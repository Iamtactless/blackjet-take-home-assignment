import { Module } from '@nestjs/common';

import { CreateGreetingUseCase } from './application/use-cases/create-greeting.use-case';
import { GetGreetingUseCase } from './application/use-cases/get-greeting.use-case';
import { GreetingRepository } from './infrastructure/repositories/greeting.repository';
import { HelloController } from './presentation/controllers/hello.controller';
import { HelloGateway } from './presentation/gateways/hello.gateway';

@Module({
  controllers: [HelloController],
  providers: [
    // Repository
    {
      provide: 'IGreetingRepository',
      useClass: GreetingRepository,
    },

    // Use cases
    GetGreetingUseCase,
    CreateGreetingUseCase,

    // WebSocket Gateway
    HelloGateway,
  ],
  exports: [HelloGateway],
})
export class HelloModule {}
