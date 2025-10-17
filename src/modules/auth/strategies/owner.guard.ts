import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';

@Injectable()
export class OwnerGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const userIdFromToken = request.user.sub;
    const userIdFromParams = request.params.id;

    if (request.url.endsWith('/me')) return true;

    return userIdFromToken === userIdFromParams;
  }
}