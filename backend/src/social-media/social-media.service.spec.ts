import { Test, TestingModule } from '@nestjs/testing';
import { SocialMediaService } from './social-media.service';
import { SocialMedia } from '../entities/social-media.entity';
import { User } from '../entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { SocialMediaMapper } from './mappers/social-media.mapper';

describe('SocialMediaService', () => {
  let service: SocialMediaService;
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
  });

  jest
    .spyOn(SocialMediaMapper, 'toResponseDto')
    .mockImplementation((socialMedia: SocialMedia) => ({
      id: socialMedia.id,
      name: socialMedia.name,
      url: socialMedia.url,
      userId: socialMedia.user.id,
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

      const createDTO = {
        name: 'socialmedia',
        url: 'https://instagram.com/user',
      };

      const socialMediaToSave = {
        ...createDTO,
        user: userExists,
      };

      const savedSocialMedia = {
        id: 1,
        ...createDTO,
        user: userExists,
      };

      mockUserRepository.findOne.mockResolvedValueOnce(userExists);
      mockSocialMediaRepository.create.mockReturnValue(socialMediaToSave);
      mockSocialMediaRepository.save.mockResolvedValue(savedSocialMedia);
      mockSocialMediaRepository.findOne.mockResolvedValueOnce(savedSocialMedia);

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

      expect(mockSocialMediaRepository.save).toHaveBeenCalledWith(
        socialMediaToSave,
      );

      expect(mockSocialMediaRepository.findOne).toHaveBeenCalledWith({
        where: { id: savedSocialMedia.id },
        relations: ['user'],
      });
    });

    it('should throw a bad request exception if user does not exist', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      const createDTO = {
        name: 'socialmedia',
        url: 'https://instagram.com/user',
      };

      await expect(service.create(1, createDTO)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  // async updateByUser(
  //     userId: number,
  //     socialMediaId: number,
  //     updateSocialMediaDto: UpdateSocialMediaDto,
  //   ): Promise<ResponseSocialMediaDto> {
  //     const socialMedia = await this.socialMediaRepository.findOne({
  //       where: { id: socialMediaId, user: { id: userId } },
  //       relations: ['user'],
  //     });

  //     if (!socialMedia) {
  //       throw new NotFoundException(
  //         `Social media with id ${socialMediaId} not found for user ${userId}`,
  //       );
  //     }
  describe('update', () => {
    //que funque
    it('should change a social media if it exists', async () => {
      const userExists = {
        id: 1,
        firstName: 'user',
        lastName: 'userlast',
        phone: '132654',
        email: 'user@email.com',
      };
      const socialMediaDTO = {
        id: 1,
        name: 'socialmedia',
        url: 'https://instagram.com/user',
        user: userExists,
      };

      const socialMediaChanged = {
        id: 1,
        name: 'socialmedia2',
        url: 'https://instagram.com/user3',
        user: userExists,
      };

      mockUserRepository.findOne.mockResolvedValueOnce(socialMediaDTO);
      mockSocialMediaRepository.save.mockResolvedValue(socialMediaChanged);

      const response = await service.updateByUser(1, 1, {
        name: 'socialmedia2',
        url: 'https://instagram.com/user3',
      });

      expect(response).toEqual({
        id: 1,
        name: 'socialmedia2',
        url: 'https://instagram.com/user3',
        user: userExists,
      });

      expect(mockSocialMediaRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1, user: { id: 1 } },
        relations: ['user'],
      });

      expect(mockSocialMediaRepository.save).toHaveBeenCalledWith({
        ...socialMediaDTO,
        name: 'socialmedia2',
        url: 'https://instagram.com/user3',
      });
    });

    it('should throw a bad request exception if  social media does not exist', async () => {
      mockSocialMediaRepository.findOne.mockResolvedValueOnce(null);

      await expect(
        service.updateByUser(1, 99, { name: 'x', url: 'y' }),
      ).rejects.toThrow(NotFoundException);

      expect(mockSocialMediaRepository.findOne).toHaveBeenCalledWith({
        where: { id: 99, user: { id: 1 } },
        relations: ['user'],
      });
    });
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
