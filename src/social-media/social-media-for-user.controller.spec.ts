import { Test, TestingModule } from '@nestjs/testing';
import { SocialMediaForUserController } from './social-media-for-user.controller';

describe('SocialMediaForUserController', () => {
  let controller: SocialMediaForUserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SocialMediaForUserController],
    }).compile();

    controller = module.get<SocialMediaForUserController>(SocialMediaForUserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
