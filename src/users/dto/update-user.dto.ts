import { IsEmail, IsOptional, IsString } from 'class-validator';

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
}
