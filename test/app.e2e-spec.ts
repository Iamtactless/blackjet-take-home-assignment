import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';

describe('HelloController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  describe('GET /hello', () => {
    it('should return a greeting', () => {
      return request(app.getHttpServer())
        .get('/hello')
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.message).toBe('Hello, World!');
          expect(res.body.data.timestamp).toBeDefined();
        });
    });

    it('should return a personalized greeting with name query param', () => {
      return request(app.getHttpServer())
        .get('/hello?name=John')
        .expect(200)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.message).toBe('Hello, John!');
        });
    });
  });

  describe('POST /hello', () => {
    it('should create a greeting', () => {
      return request(app.getHttpServer())
        .post('/hello')
        .send({ message: 'Custom greeting' })
        .expect(201)
        .expect((res) => {
          expect(res.body.success).toBe(true);
          expect(res.body.data.id).toBeDefined();
          expect(res.body.data.message).toBe('Custom greeting');
          expect(res.body.data.createdAt).toBeDefined();
        });
    });

    it('should fail with empty message', () => {
      return request(app.getHttpServer())
        .post('/hello')
        .send({ message: '' })
        .expect(400);
    });
  });
});
