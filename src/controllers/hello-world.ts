import { Request, Response } from 'express';

/**
 * GET /
 * Home page.
 */
export const helloWorld = async (_: Request, res: Response): Promise<void> => {
  res.json({ message: 'Hello World' });
};
