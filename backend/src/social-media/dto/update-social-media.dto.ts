import { IsOptional, IsString, IsUrl } from 'class-validator';

export class UpdateSocialMediaDto {
  @IsOptional()
  @IsString({ message: 'Name must be text' })
  name?: string;

  @IsOptional()
  @IsUrl({}, { message: 'URL must have a valid format' })
  url?: string;
}
