import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ReplaceUserDto } from './dto/replace-user.dto';
import { ResponseUserDto } from './dto/response-user.dto';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockResponseUser: ResponseUserDto = {
    id: 1,
    firstName: 'Ana',
    lastName: 'López',
    phone: '555123456',
    email: 'ana@example.com',
    socialMedia: [
      {
        id: 1,
        name: 'LinkedIn',
        url: 'https://linkedin.com/in/ana',
        userId: 1,
      },
    ],
  };

  const mockUserArray = [mockResponseUser];

  beforeEach(async () => {
    const usersServiceMock = {
      findAll: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      replace: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: usersServiceMock,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  describe('GET /api/users', () => {
    it('should return all users', async () => {
      // Arrange
      jest.spyOn(service, 'findAll').mockResolvedValue(mockUserArray);

      // Act
      const result = await controller.getUsers();

      // Assert
      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockUserArray);
    });

    it('should return empty array when no users exist', async () => {
      // Arrange
      jest.spyOn(service, 'findAll').mockResolvedValue([]);

      // Act
      const result = await controller.getUsers();

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return specific user when found', async () => {
      const userId = 1;

      // Arrange
      jest.spyOn(service, 'findOne').mockResolvedValue(mockResponseUser);

      // Act
      const result = await controller.getUser(userId);

      // Assert
      expect(service.findOne).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockResponseUser);
    });

    it('should throw NotFoundException when user not found', async () => {
      const userId = 999;

      // Arrange
      jest
        .spyOn(service, 'findOne')
        .mockRejectedValue(
          new NotFoundException(`User with id ${userId} not found`),
        );

      // Act / Assert
      await expect(controller.getUser(userId)).rejects.toThrow(
        NotFoundException,
      );
      expect(service.findOne).toHaveBeenCalledWith(userId);
    });
  });

  describe('POST /api/users', () => {
    it('should create user successfully', async () => {
      // Arrange
      const createUserDto: CreateUserDto = {
        firstName: 'Carlos',
        lastName: 'Martínez',
        phone: '123123123',
        email: 'carlos@example.com',
      };

      const newUser = {
        id: 2,
        ...createUserDto,
        socialMedia: [],
      };

      jest.spyOn(service, 'create').mockResolvedValue(newUser);

      // Act
      const result = await controller.createUser(createUserDto);

      // Assert
      expect(service.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(newUser);
    });
  });

  describe('PATCH /api/users/:id', () => {
    it('should update user successfully', async () => {
      const userId = 1;
      const updateUserDto: UpdateUserDto = {
        firstName: 'Ana Actualizada',
        email: 'ana_updated@example.com',
      };

      const updatedUser = { ...mockResponseUser, ...updateUserDto };

      // Arrange
      jest.spyOn(service, 'update').mockResolvedValue(updatedUser);

      // Act
      const result = await controller.updateUser(userId, updateUserDto);

      // Assert
      expect(service.update).toHaveBeenCalledWith(userId, updateUserDto);
      expect(result).toEqual(updatedUser);
    });

    it('should throw NotFoundException when updating non-existing user', async () => {
      const userId = 999;
      const updateDto: UpdateUserDto = {
        firstName: 'No Existe',
      };

      // Arrange
      jest
        .spyOn(service, 'update')
        .mockRejectedValue(
          new NotFoundException(`User with id ${userId} not found`),
        );

      // Act / Assert
      await expect(controller.updateUser(userId, updateDto)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should replace user successfully', async () => {
      const userId = 1;
      const replaceUserDto: ReplaceUserDto = {
        firstName: 'Ana Completamente Nueva',
        lastName: 'Apellido Nuevo',
        phone: '999888777',
        email: 'nueva@example.com',
      };

      const replacedUser = {
        id: userId,
        ...replaceUserDto,
        socialMedia: [],
      };

      // Arrange
      jest.spyOn(service, 'replace').mockResolvedValue(replacedUser);

      // Act
      const result = await controller.replaceUser(userId, replaceUserDto);

      // Assert
      expect(service.replace).toHaveBeenCalledWith(userId, replaceUserDto);
      expect(result).toEqual(replacedUser);
    });

    it('should throw NotFoundException when replacing non-existing user', async () => {
      const userId = 999;
      const replaceUserDto: ReplaceUserDto = {
        firstName: 'No Existe',
        lastName: 'No Existe',
        phone: '000000000',
        email: 'noexiste@example.com',
      };

      // Arrange
      jest
        .spyOn(service, 'replace')
        .mockRejectedValue(
          new NotFoundException(`User with id ${userId} not found`),
        );

      // Act / Assert
      await expect(
        controller.replaceUser(userId, replaceUserDto),
      ).rejects.toThrow(NotFoundException);
      expect(service.replace).toHaveBeenCalledWith(userId, replaceUserDto);
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should delete user successfully', async () => {
      const userId = 1;

      // Arrange
      jest.spyOn(service, 'delete').mockResolvedValue(undefined);

      // Act
      const result = await controller.deleteUser(userId);

      // Assert
      expect(service.delete).toHaveBeenCalledWith(userId);
      expect(result).toBeUndefined();
    });

    it('should throw NotFoundException when deleting non-existing user', async () => {
      const userId = 999;

      // Arrange
      jest
        .spyOn(service, 'delete')
        .mockRejectedValue(
          new NotFoundException(`User with id ${userId} not found`),
        );

      // Act / Assert
      await expect(controller.deleteUser(userId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
