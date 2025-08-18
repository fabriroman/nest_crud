import { User } from '../../entities/user.entity';
import { ResponseUserDto } from '../dto/response-user.dto';

export class UserMapper {
    static toResponseDto(user: User): ResponseUserDto {
        return {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            phone: user.phone,
            email: user.email,
        };
    }

    static toResponseDtoArray(users: User[]): ResponseUserDto[] {
        return users.map(user => this.toResponseDto(user));
    }
}
