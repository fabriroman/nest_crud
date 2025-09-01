import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SocialMedia } from '../entities/social-media.entity';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { CreateSocialMediaDto } from './dto/create-social-media.dto';
import { UpdateSocialMediaDto } from './dto/update-social-media.dto';
import { ResponseSocialMediaDto } from './dto/response-social-media.dto';
import { SocialMediaMapper } from './mappers/social-media.mapper';
import { ensureOwnershipOrAdmin } from 'src/security/ensure-ownership-or-admin';

@Injectable()
export class SocialMediaService {
  constructor(
    @InjectRepository(SocialMedia)
    private socialMediaRepository: Repository<SocialMedia>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findByUser(
    userId: number,
    actor?: { userId: number; roles: string[] },
  ): Promise<ResponseSocialMediaDto[]> {
    if (actor) ensureOwnershipOrAdmin(actor, userId);
    const socialMedias = await this.socialMediaRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
    });
    return SocialMediaMapper.toResponseDtoArray(socialMedias);
  }

  async create(
    userId: number,
    createSocialMediaDto: CreateSocialMediaDto,
    actor?: { userId: number; roles: string[] },
  ): Promise<ResponseSocialMediaDto> {
    if (actor) ensureOwnershipOrAdmin(actor, userId);
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new BadRequestException(`User with id ${userId} not found`);
    }

    const socialMedia = this.socialMediaRepository.create({
      name: createSocialMediaDto.name,
      url: createSocialMediaDto.url,
      user: user,
    });

    const savedSocialMedia = await this.socialMediaRepository.save(socialMedia);

    const socialMediaWithUser = await this.socialMediaRepository.findOne({
      where: { id: savedSocialMedia.id },
      relations: ['user'],
    });

    return SocialMediaMapper.toResponseDto(socialMediaWithUser!);
  }

  async findOneByUser(
    userId: number,
    socialMediaId: number,
    actor?: { userId: number; roles: string[] },
  ): Promise<ResponseSocialMediaDto> {
    if (actor) ensureOwnershipOrAdmin(actor, userId);
    const socialMedia = await this.socialMediaRepository.findOne({
      where: { id: socialMediaId, user: { id: userId } },
      relations: ['user'],
    });

    if (!socialMedia) {
      throw new NotFoundException(
        `Social media with id ${socialMediaId} not found for user ${userId}`,
      );
    }

    return SocialMediaMapper.toResponseDto(socialMedia);
  }

  async updateByUser(
    userId: number,
    socialMediaId: number,
    updateSocialMediaDto: UpdateSocialMediaDto,
    actor?: { userId: number; roles: string[] },
  ): Promise<ResponseSocialMediaDto> {
    if (actor) ensureOwnershipOrAdmin(actor, userId);
    const socialMedia = await this.socialMediaRepository.findOne({
      where: { id: socialMediaId, user: { id: userId } },
      relations: ['user'],
    });

    if (!socialMedia) {
      throw new NotFoundException(
        `Social media with id ${socialMediaId} not found for user ${userId}`,
      );
    }

    await this.socialMediaRepository.update(
      socialMediaId,
      updateSocialMediaDto,
    );
    const updatedSocialMedia = await this.socialMediaRepository.findOne({
      where: { id: socialMediaId },
      relations: ['user'],
    });

    return SocialMediaMapper.toResponseDto(updatedSocialMedia!);
  }

  async deleteByUser(
    userId: number,
    socialMediaId: number,
    actor?: { userId: number; roles: string[] },
  ): Promise<void> {
    if (actor) ensureOwnershipOrAdmin(actor, userId);
    const socialMedia = await this.socialMediaRepository.findOne({
      where: { id: socialMediaId, user: { id: userId } },
    });

    if (!socialMedia) {
      throw new NotFoundException(
        `Social media with id ${socialMediaId} not found for user ${userId}`,
      );
    }

    await this.socialMediaRepository.delete(socialMediaId);
  }
}
