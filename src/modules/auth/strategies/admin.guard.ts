import { CanActivate, ExecutionContext, Injectable, ForbiddenException, } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserType } from 'src/common/user-type-.enum';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('No se encontró información del usuario autenticado.');
    }

    if (user.user_type !== UserType.ADMIN) {
      throw new ForbiddenException('Acceso denegado. Se requieren privilegios de administrador.');
    }

    return true;
  }
}