import { BadRequestException, Inject, Injectable, Logger } from '@nestjs/common';

import { Greeting } from '../../domain/entities/greeting.entity';
import { IGreetingRepository } from '../../domain/interfaces/greeting-repository.interface';

export class CreateGreetingRequest {
  constructor(public readonly message: string) {}
}

export class CreateGreetingResponse {
  constructor(
    public readonly id: string,
    public readonly message: string,
    public readonly createdAt: Date,
  ) {}
}

@Injectable()
export class CreateGreetingUseCase {
  private readonly logger = new Logger(CreateGreetingUseCase.name);

  constructor(
    @Inject('IGreetingRepository')
    private readonly greetingRepository: IGreetingRepository,
  ) {}

  async execute(request: CreateGreetingRequest): Promise<CreateGreetingResponse> {
    this.logger.log('Creating greeting', { message: request.message });

    const greeting = new Greeting(
      crypto.randomUUID(),
      request.message,
      new Date(),
    );

    if (!greeting.isValid) {
      throw new BadRequestException('Message cannot be empty');
    }

    const created = await this.greetingRepository.create(greeting);

    return new CreateGreetingResponse(
      created.id,
      created.message,
      created.createdAt,
    );
  }
}
