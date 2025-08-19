import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { SocialMediaModule } from './social-media/social-media.module';
import dbConfig from './config/db.config';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
            expandVariables: true,
            load: [dbConfig],
        }),
        TypeOrmModule.forRootAsync({
            useFactory: dbConfig,
        }), 
        UsersModule, SocialMediaModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
