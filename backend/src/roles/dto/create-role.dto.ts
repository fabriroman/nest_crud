import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreateRoleDto {
  @IsNotEmpty({ message: 'Role name is required' })
  @IsString({ message: 'Role name must be text' })
  name: string;

  @IsOptional()
  @IsString({ message: 'Description must be text' })
  description?: string;
}
