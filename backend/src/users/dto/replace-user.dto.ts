import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class ReplaceUserDto {
  @IsNotEmpty({ message: 'First name is required' })
  @IsString({ message: 'First name must be text' })
  firstName: string;

  @IsNotEmpty({ message: 'Last name is required' })
  @IsString({ message: 'Last name must be text' })
  lastName: string;

  @IsNotEmpty({ message: 'Phone is required' })
  @IsString({ message: 'Phone must be text' })
  phone: string;

  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email must have a valid format' })
  email: string;

  @IsNotEmpty({ message: 'Password is required' })
  @IsString({ message: 'Password must be text' })
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}
