import { createZodDto } from 'nestjs-zod';
import { z } from 'zod';

// Request DTOs
export const GetGreetingSchema = z.object({
  name: z.string().min(1, 'Name must not be empty').optional(),
});

export class GetGreetingDto extends createZodDto(GetGreetingSchema) {}

export const CreateGreetingSchema = z.object({
  message: z.string().min(1, 'Message is required'),
});

export class CreateGreetingDto extends createZodDto(CreateGreetingSchema) {}

// Response DTOs
export class GreetingResponseDto {
  constructor(
    public readonly message: string,
    public readonly timestamp: string,
  ) {}
}

export class CreatedGreetingResponseDto {
  constructor(
    public readonly id: string,
    public readonly message: string,
    public readonly createdAt: string,
  ) {}
}
