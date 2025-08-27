import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Observable } from "rxjs/internal/Observable";
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthenticationGuard implements CanActivate {

  constructor(private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(" ")[1];
    
    if (!token) throw new UnauthorizedException("No token provided");

    try {
      const payload = this.jwtService.verify(token);
      request.userId = payload.userId;
      return true;
    } catch {
      throw new UnauthorizedException("Invalid token");
    }
  }
  /*
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
  */
}