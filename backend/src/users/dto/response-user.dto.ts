import { ResponseSocialMediaDto } from '../../social-media/dto/response-social-media.dto';
import { ResponseRoleDto } from '../../roles/dto/response-role.dto';

export class ResponseUserDto {
  id: number;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  socialMedia: ResponseSocialMediaDto[];
  roles: ResponseRoleDto[];
}
