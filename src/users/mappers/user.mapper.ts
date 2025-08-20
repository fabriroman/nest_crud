import { User } from '../../entities/user.entity';
import { ResponseUserDto } from '../dto/response-user.dto';
import { SocialMediaMapper } from '../../social-media/mappers/social-media.mapper';

export class UserMapper {
    static toResponseDto(user: User): ResponseUserDto {
        return {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            email: user.email,
            socialMedia: user.socialMedia ? SocialMediaMapper.toResponseDtoArray(user.socialMedia, user.id) : [],
        };
    }

    static toResponseDtoArray(users: User[]): ResponseUserDto[] {
        return users.map(user => this.toResponseDto(user));
    }
}
