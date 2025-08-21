// src/users/users.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { UserMapper } from './mappers/user.mapper';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ReplaceUserDto } from './dto/replace-user.dto';

// Mock User Entity
const mockUser: User = {
  id: 1,
  firstName: 'Jose',
  lastName: 'Perez',
  email: 'jose.perez@example.com',
  phone: '123-456-7890',
  socialMedia: [],
};

// Mock ResponseUserDto
const mockResponseUserDto = {
  id: 1,
  firstName: 'Jose',
  lastName: 'Perez',
  email: 'jose.perez@example.com',
  phone: '123-456-7890',
  socialMedia: [],
};

// Mock Repository
const mockUserRepository = {
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  create: jest.fn(),
};

// Mock Mapper
jest.mock('./mappers/user.mapper', () => ({
  UserMapper: {
    toResponseDto: jest.fn(),
    toResponseDtoArray: jest.fn(),
  },
}));

describe('UsersService', () => {
  let service: UsersService;
  let repository: jest.Mocked<Repository<User>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get(getRepositoryToken(User));

    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });


  //fndAl

  describe('findAll', () => {
    it('should return array of users', async () => {
      repository.find.mockResolvedValue([mockUser]);
      (UserMapper.toResponseDtoArray as jest.Mock).mockReturnValue([mockResponseUserDto]);

      const result = await service.findAll();

      expect(result).toEqual([mockResponseUserDto]);
      expect(repository.find).toHaveBeenCalledWith({ relations: ['socialMedia'] });
      expect(UserMapper.toResponseDtoArray).toHaveBeenCalledWith([mockUser]);
    });
  });

  //findOne

  describe("findOne", () => {
    it('should return a single user', async () => {
      repository.findOne.mockResolvedValue(mockUser);
      (UserMapper.toResponseDto as jest.Mock).mockReturnValue(mockResponseUserDto);

      const result = await service.findOne(1);

      expect(result).toEqual(mockResponseUserDto);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['socialMedia'],
      });
    });

    it('should throw NotFoundException if not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.findOne(99)).rejects.toThrow(NotFoundException);
    });
  });
  //create
  describe('create', () => {
    it('should create and return new user', async () => {
      const dto: CreateUserDto = {
        firstName: 'Jose',
        lastName: 'Perez',
        email: 'jose.perez@example.com',
        phone: '123-456-7890',
      };

      repository.create.mockReturnValue(mockUser);
      repository.save.mockResolvedValue(mockUser);
      repository.findOne.mockResolvedValue(mockUser);
      (UserMapper.toResponseDto as jest.Mock).mockReturnValue(mockResponseUserDto);

      const result = await service.create(dto);

      expect(result).toEqual(mockResponseUserDto);
      expect(repository.create).toHaveBeenCalledWith(dto);
      expect(repository.save).toHaveBeenCalledWith(mockUser);
    })
  })

  // update
  describe('update', () => {
    it('should update and return user', async () => {
      const dto: UpdateUserDto = { firstName: 'Juan' };

      repository.update.mockResolvedValue({ affected: 1 } as any);
      repository.findOne.mockResolvedValue(mockUser);
      (UserMapper.toResponseDto as jest.Mock).mockReturnValue(mockResponseUserDto);

      const result = await service.update(1, dto);

      expect(result).toEqual(mockResponseUserDto);
      expect(repository.update).toHaveBeenCalledWith(1, dto);
      expect(repository.findOne).toHaveBeenCalled();
    });

    it('should throw NotFoundException if not found', async () => {
      repository.update.mockResolvedValue({ affected: 1 } as any);
      repository.findOne.mockResolvedValue(null);

      await expect(service.update(99, {})).rejects.toThrow(NotFoundException);
    });
  });
  //
  // replace
  describe('replace', () => {
    it('should replace and return user', async () => {
      const dto: ReplaceUserDto = {
        firstName: 'Jose',
        lastName: 'Perez',
        email: 'jose.perez@example.com',
        phone: '123-456-7890',
      };

      repository.findOne.mockResolvedValue(mockUser);
      repository.update.mockResolvedValue({ affected: 1 } as any);
      (UserMapper.toResponseDto as jest.Mock).mockReturnValue(mockResponseUserDto);

      const result = await service.replace(1, dto);

      expect(result).toEqual(mockResponseUserDto);
      expect(repository.update).toHaveBeenCalledWith(1, dto);
    });

    it('should throw NotFoundException if not found', async () => {
      repository.findOne.mockResolvedValue(null);

      const dto: ReplaceUserDto = {
        firstName: 'any',
        lastName: 'any',
        phone: 'any',
        email: 'any',
      };

      await expect(service.replace(99, dto)).rejects.toThrow(NotFoundException);
    });
  });

  // -----------------------
  // delete
  // -----------------------
  describe('delete', () => {
    it('should delete user successfully', async () => {
      repository.findOne.mockResolvedValue(mockUser);
      repository.delete.mockResolvedValue({ affected: 1 } as any);

      await service.delete(1);

      expect(repository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw NotFoundException if not found', async () => {
      repository.findOne.mockResolvedValue(null);

      await expect(service.delete(99)).rejects.toThrow(NotFoundException);
    });
  });

});
