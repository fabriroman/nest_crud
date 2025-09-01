import { AuthenticationGuard } from '../security/guards/authentication.guard';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Patch,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { SocialMediaService } from './social-media.service';
import { CreateSocialMediaDto } from './dto/create-social-media.dto';
import { UpdateSocialMediaDto } from './dto/update-social-media.dto';
import { ResponseSocialMediaDto } from './dto/response-social-media.dto';
import { PositiveIntPipe } from '../pipes/positive-int.pipe';
import { AuthorizationGuard } from 'src/security/guards/authorization.guard';
import { OwnsResourceUserGuard } from 'src/security/guards/owns.resource.user.guard';
import { Roles } from 'src/security/decorators/roles.decorator';

@Roles(['admin', 'user'])
@UseGuards(AuthenticationGuard, AuthorizationGuard, OwnsResourceUserGuard)
@Controller('api/users/:userId/social-media')
export class SocialMediaForUserController {
  constructor(private readonly socialMediaService: SocialMediaService) {}

  @Get()
  async getSocialMediasByUser(
    @Param('userId', PositiveIntPipe) userId: number,
    @Req() req: Request & { userId: number; userRoles: string[] },
  ): Promise<ResponseSocialMediaDto[]> {
    const actor = { userId: req.userId, roles: req.userRoles };
    return this.socialMediaService.findByUser(userId, actor);
  }

  @Get(':id')
  async getSocialMediaByUser(
    @Param('userId', PositiveIntPipe) userId: number,
    @Param('id', PositiveIntPipe) id: number,
    @Req() req: Request & { userId: number; userRoles: string[] },
  ): Promise<ResponseSocialMediaDto> {
    const actor = { userId: req.userId, roles: req.userRoles };
    return this.socialMediaService.findOneByUser(userId, id, actor);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createSocialMediaForUser(
    @Param('userId', PositiveIntPipe) userId: number,
    @Body() createSocialMediaDto: CreateSocialMediaDto,
    @Req() req: Request & { userId: number; userRoles: string[] },
  ): Promise<ResponseSocialMediaDto> {
    const actor = { userId: req.userId, roles: req.userRoles };
    return this.socialMediaService.create(userId, createSocialMediaDto, actor);
  }

  @Patch(':id')
  async updateSocialMediaForUser(
    @Param('userId', PositiveIntPipe) userId: number,
    @Param('id', PositiveIntPipe) id: number,
    @Body() updateSocialMediaDto: UpdateSocialMediaDto,
    @Req() req: Request & { userId: number; userRoles: string[] },
  ): Promise<ResponseSocialMediaDto> {
    const actor = { userId: req.userId, roles: req.userRoles };
    return this.socialMediaService.updateByUser(userId, id, updateSocialMediaDto, actor);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSocialMediaForUser(
    @Param('userId', PositiveIntPipe) userId: number,
    @Param('id', PositiveIntPipe) id: number,
    @Req() req: Request & { userId: number; userRoles: string[] },
  ): Promise<void> {
    const actor = { userId: req.userId, roles: req.userRoles };
    return this.socialMediaService.deleteByUser(userId, id, actor);
  }
}
