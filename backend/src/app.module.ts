import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SocialMediaModule } from './social-media/social-media.module';
import { AuthModule } from './auth/auth.module';
import { RolesModule } from './roles/roles.module';
import dbConfig from './config/db.config';
import { JwtModule } from '@nestjs/jwt';
import { SecurityModule } from './security/security.module';
import jwtConfig from './config/jwt.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      expandVariables: true,
      load: [dbConfig, jwtConfig],
    }),
    TypeOrmModule.forRootAsync({
      useFactory: dbConfig,
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: jwtConfig,
      global: true,
      inject: [ConfigService],
    }),
    UsersModule,
    SocialMediaModule,
    AuthModule,
    RolesModule,
    SecurityModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
