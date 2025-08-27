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
} from '@nestjs/common';
import { SocialMediaService } from './social-media.service';
import { CreateSocialMediaDto } from './dto/create-social-media.dto';
import { UpdateSocialMediaDto } from './dto/update-social-media.dto';
import { ResponseSocialMediaDto } from './dto/response-social-media.dto';
import { PositiveIntPipe } from '../pipes/positive-int.pipe';

@Controller('api/users/:userId/social-media')
export class SocialMediaForUserController {
  constructor(private readonly socialMediaService: SocialMediaService) {}

  @Get()
  async getSocialMediasByUser(
    @Param('userId', PositiveIntPipe) userId: number,
  ): Promise<ResponseSocialMediaDto[]> {
    return this.socialMediaService.findByUser(userId);
  }

  @Get(':id')
  async getSocialMediaByUser(
    @Param('userId', PositiveIntPipe) userId: number,
    @Param('id', PositiveIntPipe) id: number,
  ): Promise<ResponseSocialMediaDto> {
    return this.socialMediaService.findOneByUser(userId, id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createSocialMediaForUser(
    @Param('userId', PositiveIntPipe) userId: number,
    @Body() createSocialMediaDto: CreateSocialMediaDto,
  ): Promise<ResponseSocialMediaDto> {
    return this.socialMediaService.create(userId, createSocialMediaDto);
  }

  @Patch(':id')
  async updateSocialMediaForUser(
    @Param('userId', PositiveIntPipe) userId: number,
    @Param('id', PositiveIntPipe) id: number,
    @Body() updateSocialMediaDto: UpdateSocialMediaDto,
  ): Promise<ResponseSocialMediaDto> {
    return this.socialMediaService.updateByUser(
      userId,
      id,
      updateSocialMediaDto,
    );
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteSocialMediaForUser(
    @Param('userId', PositiveIntPipe) userId: number,
    @Param('id', PositiveIntPipe) id: number,
  ): Promise<void> {
    return this.socialMediaService.deleteByUser(userId, id);
  }
}
