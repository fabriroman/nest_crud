import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { RolesModule } from '../roles/roles.module';
import { SecurityModule } from 'src/security/security.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role]), 
    RolesModule,
    SecurityModule
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}