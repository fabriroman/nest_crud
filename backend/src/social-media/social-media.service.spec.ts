import { Test, TestingModule } from '@nestjs/testing';
import { SocialMediaService } from './social-media.service';
import { SocialMedia } from '../entities/social-media.entity';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { SocialMediaMapper } from './mappers/social-media.mapper';

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

  jest
    .spyOn(SocialMediaMapper, 'toResponseDto')
    .mockImplementation((socialMedia: SocialMedia) => ({
      id: socialMedia.id,
      name: socialMedia.name,
      url: socialMedia.url,
      userId: socialMedia.user?.id,
    }));

  jest
    .spyOn(SocialMediaMapper, 'toResponseDtoArray')
    .mockImplementation((socialMedias: SocialMedia[]) =>
      socialMedias.map((socialMedia) => ({
        id: socialMedia.id,
        name: socialMedia.name,
        url: socialMedia.url,
        userId: socialMedia.user?.id,
      })),
    );

  afterEach(() => {
    jest.clearAllMocks();
  });

  // Test if the service is defined
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findByUser', () => {
    it('should return social media DTOs for a given user', async () => {
      const userId = 1;
      const socialMedias = [
        {
          id: 1,
          name: 'Facebook',
          url: 'https://facebook.com/user',
          user: { id: userId },
        },
        {
          id: 2,
          name: 'Twitter',
          url: 'https://twitter.com/user',
          user: { id: userId },
        },
      ] as SocialMedia[];

      mockSocialMediaRepository.find.mockResolvedValue(socialMedias);

      const result = await service.findByUser(userId);

      expect(result).toEqual([
        { id: 1, name: 'Facebook', url: 'https://facebook.com/user', userId },
        { id: 2, name: 'Twitter', url: 'https://twitter.com/user', userId },
      ]);
      expect(mockSocialMediaRepository.find).toHaveBeenCalledWith({
        where: { user: { id: userId } },
        relations: ['user'],
      });
    });
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

  describe('findOneByUser', () => {
    it('should return a social media DTO for a given user and social media ID', async () => {
      const userId = 1;
      const socialMediaId = 1;
      const socialMedia = {
        id: socialMediaId,
        name: 'Facebook',
        url: 'https://facebook.com/user',
        user: { id: userId },
      } as SocialMedia;

      mockSocialMediaRepository.findOne.mockResolvedValue(socialMedia);

      const result = await service.findOneByUser(userId, socialMediaId);
      expect(result).toEqual({
        id: socialMediaId,
        name: 'Facebook',
        url: 'https://facebook.com/user',
        userId,
      });
    });

    it('should throw NotFoundException if social media not found', async () => {
      mockSocialMediaRepository.findOne.mockResolvedValue(null);
      await expect(service.findOneByUser(1, 999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deleteByUser', () => {
    it('should delete a social media by user ID and social media ID', async () => {
      const userId = 1;
      const socialMediaId = 1;
      const socialMedia = {
        id: socialMediaId,
        name: 'Facebook',
        url: 'https://facebook.com/user',
        user: { id: userId },
      } as SocialMedia;

      mockSocialMediaRepository.findOne.mockResolvedValue(socialMedia);
      mockSocialMediaRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.deleteByUser(userId, socialMediaId);
      expect(result).toBeUndefined();
      expect(mockSocialMediaRepository.delete).toHaveBeenCalledWith(
        socialMediaId,
      );
    });

    it('should throw NotFoundException if social media to delete is not found', async () => {
      mockSocialMediaRepository.findOne.mockResolvedValue(null);
      await expect(service.deleteByUser(1, 999)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
