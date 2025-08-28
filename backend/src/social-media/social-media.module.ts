import { Module, ValidationPipe, forwardRef } from '@nestjs/common';
import { SocialMediaForUserController } from './social-media-for-user.controller';
import { SocialMediaService } from './social-media.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SocialMedia } from '../entities/social-media.entity';
import { User } from '../entities/user.entity';
import { APP_PIPE } from '@nestjs/core';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SocialMedia, User]),
    forwardRef(() => AuthModule)
  ],
  controllers: [SocialMediaForUserController],
  providers: [
    SocialMediaService,
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    },
  ],
  exports: [SocialMediaService],
})
export class SocialMediaModule {}
