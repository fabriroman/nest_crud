import { CanActivate, ExecutionContext, Injectable, ForbiddenException, UnauthorizedException, BadRequestException } from "@nestjs/common";


@Injectable()
export class OwnsResourceUserGuard implements CanActivate {

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // Guards run before pipes, so validate id here
    const resourceId = parseInt(request.params.userId, 10);
    if (isNaN(resourceId) || resourceId <= 0) {
      throw new BadRequestException('Validation failed (positive integer is expected)');
    }

    // Ensure userId exists and is a number
    if (request.userId === undefined || request.userId === null) {
      throw new UnauthorizedException("User Id not found");
    }
    const userId = typeof request.userId === 'number' ? request.userId : parseInt(request.userId, 10);
    if (isNaN(userId)) throw new UnauthorizedException("Invalid user id");

    const userRoles: string[] = request.userRoles;
    if (!userRoles) throw new UnauthorizedException("User roles not found");

    if (userRoles.some((role: string) => role === 'admin')) {
        return true;
    }

    if (userId !== resourceId) {
      throw new ForbiddenException("Access denied");
    }

    return true;
  }
}