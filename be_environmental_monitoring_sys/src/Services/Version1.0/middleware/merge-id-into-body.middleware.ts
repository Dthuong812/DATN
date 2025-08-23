import { Request, Response, NextFunction } from 'express';

export function mergeIdIntoBody(req: Request, res: Response, next: NextFunction) {
  const paramId = req.params.Id || req.params.id;
  if (paramId) {
    req.body.Id = +paramId;
  }
  next();
}
