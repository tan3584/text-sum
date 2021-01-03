import { HttpStatus, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { METADATA } from '../constants/metadata/metadata.constant';
import { UserRepository } from '../../modules/user/user.repository';

@Injectable()
export class UserAuthenticationGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly userRepository: UserRepository,
  ) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const isPublic = this.reflector.get<boolean>(
      METADATA.IS_PUBLIC,
      context.getHandler(),
    );

    if (isPublic) {
      console.log('public');
      return true;
    }
    const request = this._getRequest(context);
    return this._handleRequest(request);
  }

  private async _handleRequest(req: Request): Promise<boolean> {
    const token = (req as any).user;
    if (!token) {
      return false;
    }
    return true;
  }

  private _getRequest<T = any>(context: ExecutionContext): T {
    return context.switchToHttp().getRequest();
  }
}
