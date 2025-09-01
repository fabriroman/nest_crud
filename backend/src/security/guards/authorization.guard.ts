import { CanActivate, ExecutionContext, Injectable, ForbiddenException, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ROLES_KEY } from "src/security/decorators/roles.decorator";
import { RolesService } from 'src/roles/roles.service';


@Injectable()
export class AuthorizationGuard implements CanActivate {

  constructor(private reflector: Reflector, private roleService: RolesService) {}
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
      const userRoles = await this.roleService.getRolesByUserId(request.userId);
      if (!userRoles) throw new UnauthorizedException("User role not found");

      for (const role of requiredRoles) {

        if (userRoles.some(userRole => userRole.name === role)){
          request.userRoles = userRoles.map(r => r.name);
          return true;
        }
      }

      throw new ForbiddenException("Access denied");
    } catch (error) {
      console.log(error);
      throw new ForbiddenException("Access denied");
    }
  }
}