import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
@Injectable()
export class GraphqlMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    // only accecpt /graphql
    if (req.originalUrl === '/graphql') {
      return next();
    }
    if (req.originalUrl === '/') {
      return res.status(200).send({ status: 'OK' });
    }
    res.send('Can not GET');
  }
}
