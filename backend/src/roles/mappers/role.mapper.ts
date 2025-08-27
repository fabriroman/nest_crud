import { Role } from '../../entities/role.entity';
import { ResponseRoleDto } from '../dto/response-role.dto';

export class RoleMapper {
  static toResponseDto(role: Role): ResponseRoleDto {
    return {
      id: role.id,
      name: role.name,
      description: role.description,
    };
  }

  static toResponseDtoArray(roles: Role[]): ResponseRoleDto[] {
    return roles.map((role) => this.toResponseDto(role));
  }
}
