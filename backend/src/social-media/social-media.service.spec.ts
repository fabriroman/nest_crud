import { Test, TestingModule } from '@nestjs/testing';
import { SocialMediaService } from './social-media.service';
import { SocialMedia } from '../entities/social-media.entity';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('SocialMediaService', () => {
  let service: SocialMediaService;
  let socialMediaRepo: Repository<SocialMedia>;
  let userRepo: Repository<User>;

  const mockSocialMediaRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockUserRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SocialMediaService,
        {
          provide: getRepositoryToken(SocialMedia),
          useValue: mockSocialMediaRepository,
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<SocialMediaService>(SocialMediaService);

    socialMediaRepo = module.get<Repository<SocialMedia>>(
      getRepositoryToken(SocialMedia),
    );
    userRepo = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  //
  //
  //CREATE UNIT TESTS
  describe('create', () => {
    //que funque
    it('should create a social media if user exists', async () => {
      const userExists = {
        id: 1,
        firstName: 'user',
        lastName: 'userlast',
        phone: '132654',
        email: 'user@email.com',
      };

      const socialMediaExists = {
        id: 1,
        name: 'socialmedia',
        url: 'https://instagram.com/user',
        user: userExists,
      };

      mockUserRepository.findOne.mockReturnValue(Promise.resolve(userExists));
      mockSocialMediaRepository.create.mockReturnValue(socialMediaExists);
      mockSocialMediaRepository.save.mockReturnValue(
        Promise.resolve(socialMediaExists),
      );
      mockSocialMediaRepository.findOne.mockReturnValue(
        Promise.resolve(socialMediaExists),
      );
      const createDTO = {
        name: 'socialmedia',
        url: 'https://instagram.com/user',
      };

      const response = await service.create(1, createDTO);

      expect(response).toEqual({
        id: 1,
        name: 'socialmedia',
        url: 'https://instagram.com/user',
        userId: 1,
      });
      expect(mockSocialMediaRepository.create).toHaveBeenCalledWith({
        name: 'socialmedia',
        url: 'https://instagram.com/user',
        user: userExists,
      });

      expect(mockSocialMediaRepository.save).toHaveBeenCalled();
    });

    ////que falle
    //it('should throw a bad request exception if user does not exist', async () => {});
  });
});
