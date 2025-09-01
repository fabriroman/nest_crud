import { Module } from '@nestjs/common';
import { AuthenticationGuard } from './guards/authentication.guard';
import { AuthorizationGuard } from './guards/authorization.guard';
import { RolesModule } from 'src/roles/roles.module';
import { OwnsResourceUserGuard } from './guards/owns.resource.user.guard';

@Module({
  imports: [RolesModule],
  providers: [AuthenticationGuard, AuthorizationGuard, OwnsResourceUserGuard],
  exports: [AuthenticationGuard, AuthorizationGuard, OwnsResourceUserGuard, RolesModule],
})
export class SecurityModule {}
