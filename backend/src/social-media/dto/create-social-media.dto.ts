import { IsNotEmpty, IsString, IsUrl } from 'class-validator';

export class CreateSocialMediaDto {
  @IsNotEmpty({ message: 'Name is required' })
  @IsString({ message: 'Name must be text' })
  name: string;

  @IsNotEmpty({ message: 'URL is required' })
  @IsUrl({}, { message: 'URL must have a valid format' })
  url: string;
}
