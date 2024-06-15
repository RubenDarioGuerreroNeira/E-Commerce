/* eslint-disable prettier/prettier */
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly jwService: JwtService) { }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // accedo al request
    const request = context.switchToHttp().getRequest()

    const token = request.headers.authorization?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Bad Request, Require Token');

    }

    const secret = process.env.JWT_SECRET;                                                               /*'29800';*/
    const user = this.jwService.verify(token, { secret })
    user.exp = new Date(user.exp * 1000)


    if (user.isSuperAdmin) {
      user.roles = ['sadmin', 'admin', 'user'];
    } else if (user.isAdmin) {
      user.roles = ['admin', 'user'];
    } else {
      user.roles = ['user'];
    }
    request.user = user

    return true;
  }
}
