import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: 'First name must be text' })
  firstName?: string;

  @IsOptional()
  @IsString({ message: 'Last name must be text' })
  lastName?: string;

  @IsOptional()
  @IsString({ message: 'Phone must be text' })
  phone?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email must have a valid format' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'Password must be text' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password?: string;
}
