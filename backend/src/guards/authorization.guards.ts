import { CanActivate, ExecutionContext, Injectable, ForbiddenException, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { AuthService } from "src/auth/auth.service";
import { ROLES_KEY } from "src/decorators/roles.decorator";


@Injectable()
export class AuthorizationGuard implements CanActivate {

  constructor(private reflector: Reflector, private authService: AuthService) {}
  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    if (!request.userId) throw new UnauthorizedException("User Id not found");

    const requiredRoles = this.reflector.getAllAndOverride(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true; // No roles required

    try {
      const userRoles = await this.authService.getUserRoles(request.userId);
      if (!userRoles) throw new UnauthorizedException("User role not found");

      for (const role of requiredRoles) {

        if (userRoles.some(userRole => userRole.name === role)) return true;
      }

      throw new ForbiddenException("Access denied");
    } catch (error) {
      throw new ForbiddenException("Access denied");
    }
  }
}