import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class KeyAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    try {
      const ctx = GqlExecutionContext.create(context);
      const request = ctx.getContext().req;
      const key = request.headers.key;
      if (key !== process.env.ADMIN_SECRET_KEY) {
        throw new UnauthorizedException();
      }
      return true;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
  public getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
}
