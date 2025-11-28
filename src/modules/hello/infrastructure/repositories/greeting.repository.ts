import { Injectable, Logger } from '@nestjs/common';

import { Greeting } from '../../domain/entities/greeting.entity';
import { IGreetingRepository } from '../../domain/interfaces/greeting-repository.interface';

@Injectable()
export class GreetingRepository implements IGreetingRepository {
  private readonly logger = new Logger(GreetingRepository.name);

  // In-memory storage for demo purposes
  // In a real application, this would use a database
  private readonly greetings: Map<string, Greeting> = new Map([]);

  async findById(id: string): Promise<Greeting | null> {
    this.logger.debug('Finding greeting by id', { id });
    return this.greetings.get(id) || null;
  }

  async findAll(): Promise<Greeting[]> {
    this.logger.debug('Finding all greetings');
    return Array.from(this.greetings.values());
  }

  async create(greeting: Greeting): Promise<Greeting> {
    this.logger.debug('Creating greeting', { id: greeting.id });
    this.greetings.set(greeting.id, greeting);
    return greeting;
  }
}
