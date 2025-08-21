import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';

import { SocialMediaForUserController } from './social-media-for-user.controller';
import { SocialMediaService } from './social-media.service';
import { CreateSocialMediaDto } from './dto/create-social-media.dto';
import { UpdateSocialMediaDto } from './dto/update-social-media.dto';
import { ResponseSocialMediaDto } from './dto/response-social-media.dto';
import { PositiveIntPipe } from '../pipes/positive-int.pipe';

describe('SocialMediaForUserController', () => {
  let controller: SocialMediaForUserController;
  let service: SocialMediaService;

  const mockResponseSocialMedia: ResponseSocialMediaDto = {
    id: 1,
    name: 'LinkedIn',
    url: 'https://linkedin.com/in/user',
    userId: 1,
  };

  const mockSocialMediaArray = [mockResponseSocialMedia];

  const mockPositiveIntPipe = {
    transform: (value: string) => parseInt(value, 10),
  };

  beforeEach(async () => {
    const socialMediaServiceMock = {
      findByUser: jest.fn(),
      findOneByUser: jest.fn(),
      create: jest.fn(),
      updateByUser: jest.fn(),
      deleteByUser: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [SocialMediaForUserController],
      providers: [
        {
          provide: SocialMediaService,
          useValue: socialMediaServiceMock,
        },
        {
          provide: PositiveIntPipe,
          useValue: mockPositiveIntPipe,
        },
      ],
    }).compile();

    controller = module.get<SocialMediaForUserController>(
      SocialMediaForUserController,
    );
    service = module.get<SocialMediaService>(SocialMediaService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  describe('GET /api/users/:userId/social-media', () => {
    it('should return all social media accounts for a user', async () => {
      // Arrange
      const userId = 1;
      jest.spyOn(service, 'findByUser').mockResolvedValue(mockSocialMediaArray);

      // Act
      const result = await controller.getSocialMediasByUser(userId);

      // Assert
      expect(service.findByUser).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockSocialMediaArray);
    });

    it('should return empty array when user has no social media accounts', async () => {
      // Arrange
      const userId = 999;
      jest.spyOn(service, 'findByUser').mockResolvedValue([]);

      // Act
      const result = await controller.getSocialMediasByUser(userId);

      // Assert
      expect(service.findByUser).toHaveBeenCalledWith(userId);
      expect(result).toEqual([]);
    });
  });

  describe('GET /api/users/:userId/social-media/:id', () => {
    it('should return specific social media account when found', async () => {
      const userId = 1;
      const id = 1;

      // Arrange
      jest
        .spyOn(service, 'findOneByUser')
        .mockResolvedValue(mockResponseSocialMedia);

      // Act
      const result = await controller.getSocialMediaByUser(userId, id);

      // Assert
      expect(service.findOneByUser).toHaveBeenCalledWith(userId, id);
      expect(result).toEqual(mockResponseSocialMedia);
    });

    it('should throw NotFoundException when social media not found', async () => {
      const userId = 1;
      const id = 999;

      // Arrange
      jest
        .spyOn(service, 'findOneByUser')
        .mockRejectedValue(
          new NotFoundException(
            `Social media with id ${id} not found for user ${userId}`,
          ),
        );

      // Act / Assert
      await expect(controller.getSocialMediaByUser(userId, id)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.findOneByUser).toHaveBeenCalledWith(userId, id);
    });
  });

  describe('POST /api/users/:userId/social-media', () => {
    it('should create a new social media account for user', async () => {
      const userId = 1;
      const createDto: CreateSocialMediaDto = {
        name: 'Twitter',
        url: 'https://twitter.com/user',
      };

      const newSocialMedia = {
        id: 2,
        ...createDto,
        userId,
      };

      // Arrange
      jest.spyOn(service, 'create').mockResolvedValue(newSocialMedia);

      // Act
      const result = await controller.createSocialMediaForUser(
        userId,
        createDto,
      );

      // Assert
      expect(service.create).toHaveBeenCalledWith(userId, createDto);
      expect(result).toEqual(newSocialMedia);
    });

    it('should throw error when creation fails', async () => {
      const userId = 1;
      const createDto: CreateSocialMediaDto = {
        name: 'Invalid',
        url: '',
      };

      // Arrange
      jest
        .spyOn(service, 'create')
        .mockRejectedValue(new Error('Failed to create social media'));

      // Act / Assert
      await expect(
        controller.createSocialMediaForUser(userId, createDto),
      ).rejects.toThrow();
      expect(service.create).toHaveBeenCalledWith(userId, createDto);
    });
  });
});
