import { SocialMedia } from '../../entities/social-media.entity';
import { ResponseSocialMediaDto } from '../dto/response-social-media.dto';

export class SocialMediaMapper {
  static toResponseDto(
    socialMedia: SocialMedia,
    userId?: number,
  ): ResponseSocialMediaDto {
    return {
      id: socialMedia.id,
      name: socialMedia.name,
      url: socialMedia.url,
      userId: userId || socialMedia.user?.id,
    };
  }

  static toResponseDtoArray(
    socialMedias: SocialMedia[],
    userId?: number,
  ): ResponseSocialMediaDto[] {
    return socialMedias.map((socialMedia) =>
      this.toResponseDto(socialMedia, userId),
    );
  }
}
