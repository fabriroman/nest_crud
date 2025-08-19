import { SocialMedia } from '../../entities/social-media.entity';
import { ResponseSocialMediaDto } from '../dto/response-social-media.dto';

export class SocialMediaMapper {
    static toResponseDto(socialMedia: SocialMedia): ResponseSocialMediaDto {
        return {
            id: socialMedia.id,
            name: socialMedia.name,
            url: socialMedia.url,
            userId: socialMedia.user.id,
        };
    }

    static toResponseDtoArray(socialMedias: SocialMedia[]): ResponseSocialMediaDto[] {
        return socialMedias.map(socialMedia => this.toResponseDto(socialMedia));
    }
}
