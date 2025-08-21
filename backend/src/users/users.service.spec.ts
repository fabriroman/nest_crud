import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { find } from 'rxjs';
import { create } from 'domain';
import { Repository } from 'typeorm';

import { ResponseUserDto } from './dto/response-user.dto';
import { User } from 'src/entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { UserMapper } from './mappers/user.mapper';
import { NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ReplaceUserDto } from './dto/replace-user.dto';


const mockUserRepository = {
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  create: jest.fn(),
}


describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>

  const mockUser = {
    id: 1,
    firstName: 'Jose',
    lastName: 'Perez',
    phone: '123-456-7890',
    email: 'jose.perez@example.com',
    socialMedia: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  } as User

  const mockUserDto = {
    id: 1,
    firstName: 'Jose',
    lastName: 'Perez',
    phone: '123-456-7890',
    email: 'jose.perez@example.com',
  } as ResponseUserDto;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        }
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User))

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return array of users', async () => {
      jest.spyOn(repository, 'find').mockResolvedValue([mockUser]);
      jest.spyOn(UserMapper, 'toResponseDtoArray').mockReturnValue([mockUserDto]);

      const result = await service.findAll();
      expect(result).toEqual([mockUser]);
      expect(repository.find).toHaveBeenCalledTimes(1);
    });
  })

  describe('findOne', () => {
    it('should return a single user', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(UserMapper, 'toResponseDto').mockReturnValue(mockUserDto);

      const result = await service.findOne(1)
      expect(result).toEqual(mockUserDto)
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 }, relations: ['socialMedia'] });
    });

    it('should throw a NotFoundException if the user does not exist', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      // Assert that the method throws the correct exception
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
      expect(repository.findOne).toHaveBeenCalledTimes(1);
    });
  });

  //Test for create mothod

  describe('create', () => {
    it('should create and return a new user', async () => {
      const createUserDto: CreateUserDto = { firstName: 'New', lastName: 'User', phone: '123', email: 'new.user@test.com' };
      const createdUser = { ...mockUser, ...createUserDto };

      // Mock the repository's create and save methods
      jest.spyOn(repository, 'create').mockReturnValue(createdUser as any);
      jest.spyOn(repository, 'save').mockResolvedValue(createdUser as any);
      // Mock the findOne call that happens after save
      jest.spyOn(repository, 'findOne').mockResolvedValue(createdUser as any);
      // Mock the mapper
      jest.spyOn(UserMapper, 'toResponseDto').mockReturnValue(mockUserDto);

      const result = await service.create(createUserDto);
      expect(repository.create).toHaveBeenCalledWith(createUserDto);
      expect(repository.save).toHaveBeenCalledWith(createdUser);
      expect(result).toEqual(mockUserDto);
    });
  })

  //Test for update method

  describe('update', () => {
    it('should update and return the updated user', async () => {
      const updateUserDto: UpdateUserDto = { firstName: 'Updated', phone: '987-654-3210' }
      const updateUser = { ...mockUser, ...updateUserDto }

      jest.spyOn(repository, 'update').mockResolvedValue({ affected: 1 } as any)

      jest.spyOn(repository, 'findOne').mockResolvedValue(updateUser as any)

      jest.spyOn(UserMapper, 'toResponseDto').mockReturnValue(mockUserDto)

      const result = await service.update(1, updateUserDto);
      expect(repository.update).toHaveBeenCalledWith(1, updateUserDto);
      expect(result).toEqual(mockUserDto);
    });

    it('should throw a NotFoundException if the user to update is not found', async () => {

      jest.spyOn(repository, 'update').mockResolvedValue({ affected: 0 } as any);
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.update(999, {} as UpdateUserDto)).rejects.toThrow(NotFoundException);
    });
  });

  // Test for replace method

  describe('replace', () => {
    it('should replace and return', async () => {
      const replaceUserDto: ReplaceUserDto = { firstName: 'Replaced', lastName: 'Name', phone: '111', email: 'replaced@example.com' }
      const replacedUser = { ...mockUser, ...replaceUserDto }

      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(mockUser);
      // Mock the repository's update
      jest.spyOn(repository, 'update').mockResolvedValue({ affected: 1 } as any);
      // Mock the repository's findOne (for returning the updated user)
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(replacedUser as any);
      // Mock the mapper
      jest.spyOn(UserMapper, 'toResponseDto').mockReturnValue(mockUserDto);

      const result = await service.replace(1, replaceUserDto);
      expect(repository.update).toHaveBeenCalledWith(1, replaceUserDto);
      expect(result).toEqual(mockUserDto);
    })

    it('should throw a NotFoundException if the user to replaace is not found', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null)

      await expect(service.replace(999, {} as ReplaceUserDto)).rejects.toThrow(NotFoundException)
    });
  })

  //Test for delete methodd

  describe('delete', () => {
    it('should delete a user successfully', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockUser);
      jest.spyOn(repository, 'delete').mockResolvedValue({ affected: 1 } as any)

      await service.delete(1)
      expect(repository.delete).toHaveBeenCalledWith(1)
    })

    it('should throw a NotFoundException if the user to delete is not found ', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null)

      await expect(service.delete(999)).rejects.toThrow(NotFoundException)
      expect(repository.delete).not.toHaveBeenCalled()
    })
  })
});
