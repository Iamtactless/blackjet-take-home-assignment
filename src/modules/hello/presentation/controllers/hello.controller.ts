import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';

import { createSuccessResponse } from '../../../../shared/helpers/api-response.helper';
import {
  CreateGreetingRequest,
  CreateGreetingUseCase,
} from '../../application/use-cases/create-greeting.use-case';
import {
  GetGreetingRequest,
  GetGreetingUseCase,
} from '../../application/use-cases/get-greeting.use-case';
import { CreateGreetingDto, GetGreetingDto } from '../dtos/greeting.dto';

@Controller('hello')
export class HelloController {
  constructor(
    private readonly getGreetingUseCase: GetGreetingUseCase,
    private readonly createGreetingUseCase: CreateGreetingUseCase,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getGreeting(@Query() query: GetGreetingDto) {
    const request = new GetGreetingRequest(query.name);
    const result = await this.getGreetingUseCase.execute(request);

    return createSuccessResponse({
      message: 'Greeting retrieved successfully',
      data: {
        message: result.message,
        timestamp: result.timestamp.toISOString(),
      },
    });
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createGreeting(@Body() body: CreateGreetingDto) {
    const request = new CreateGreetingRequest(body.message);
    const result = await this.createGreetingUseCase.execute(request);

    return createSuccessResponse({
      message: 'Greeting created successfully',
      statusCode: HttpStatus.CREATED,
      data: {
        id: result.id,
        message: result.message,
        createdAt: result.createdAt.toISOString(),
      },
    });
  }
}
