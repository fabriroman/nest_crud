import { IsOptional, IsString } from 'class-validator';

export class UpdateRoleDto {
  @IsOptional()
  @IsString({ message: 'Role name must be text' })
  name?: string;

  @IsOptional()
  @IsString({ message: 'Description must be text' })
  description?: string;
}
