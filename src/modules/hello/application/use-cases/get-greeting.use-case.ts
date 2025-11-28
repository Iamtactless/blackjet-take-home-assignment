import { Inject, Injectable, Logger } from '@nestjs/common';

import { Greeting } from '../../domain/entities/greeting.entity';
import { IGreetingRepository } from '../../domain/interfaces/greeting-repository.interface';

export class GetGreetingRequest {
  constructor(public readonly name?: string) {}
}

export class GetGreetingResponse {
  constructor(public readonly message: string, public readonly timestamp: Date) {}
}

@Injectable()
export class GetGreetingUseCase {
  private readonly logger = new Logger(GetGreetingUseCase.name);

  constructor(
    @Inject('IGreetingRepository')
    private readonly greetingRepository: IGreetingRepository,
  ) {}

  async execute(request: GetGreetingRequest): Promise<GetGreetingResponse> {
    this.logger.log('Generating greeting', { name: request.name });

    const greetings = await this.greetingRepository.findAll();
    const defaultGreeting = greetings[0];

    this.logger.log('default greeting', greetings);

    const message = request.name
      ? `Hello, ${request.name}!`
      : defaultGreeting?.message || 'Hello, World!';

    return new GetGreetingResponse(message, new Date());
  }
}
