import { Greeting } from '../entities/greeting.entity';

export interface IGreetingRepository {
  findById(id: string): Promise<Greeting | null>;
  findAll(): Promise<Greeting[]>;
  create(greeting: Greeting): Promise<Greeting>;
}
