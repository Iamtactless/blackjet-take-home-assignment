import { Router } from 'express';

import { helloWorld } from '@/controllers/hello-world';

export const helloWorldRouter: Router = Router();

/**
 * @openapi
 * /api/hello:
 *   x-swagger-router-controller: helloWorld
 *   get:
 *     tags:
 *       - Greeting
 *     summary: Returns a hello world message
 *     description: Simple endpoint that returns a greeting message
 *     responses:
 *       '200':
 *         description: Successful response with greeting
 *         content:
 *           application/json:
 *             example:
 *               message: "Hello, World!"
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       '500':
 *         description: Internal server error
 *         content:
 *           application/json:
 *             example:
 *               error: "Something went wrong"
 */
helloWorldRouter.get('/', helloWorld);
