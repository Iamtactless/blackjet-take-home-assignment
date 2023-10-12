import request from 'supertest';

import { app } from '@/app';

describe('GET /', () => {
  it('should return 200 OK', () => {
    return request(app).get('/').expect(200);
  });

  it('should return Hello World', () => {
    return request(app)
      .get('/')
      .expect(200)
      .expect(res => {
        expect(res.body.message).toContain('Hello World');
      });
  });
});
