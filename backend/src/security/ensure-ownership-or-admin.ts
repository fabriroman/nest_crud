import { ForbiddenException, UnauthorizedException, BadRequestException } from '@nestjs/common';


export function ensureOwnershipOrAdmin(
  actor: { userId: number; roles: string[] },
  resourceId: number,
): void {
  if (!actor) {
    throw new UnauthorizedException('Actor not provided');
  }

  const { userId, roles } = actor;

  if (!roles || !Array.isArray(roles)) {
    throw new UnauthorizedException('Actor roles not provided');
  }

  // Admin bypass
  if (roles.includes('admin')) {
    return;
  }

  if (userId === undefined || userId === null) {
    throw new UnauthorizedException('Actor userId not provided');
  }

  if (isNaN(userId)) {
    throw new BadRequestException('Invalid actor userId');
  }

  if (userId !== resourceId) {
    throw new ForbiddenException('Access denied');
  }
}



