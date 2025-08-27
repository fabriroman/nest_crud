import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ReplaceUserDto } from './dto/replace-user.dto';
import { ResponseUserDto } from './dto/response-user.dto';

import { UserMapper } from './mappers/user.mapper';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<ResponseUserDto[]> {
    const users = await this.userRepository.find({
      relations: ['socialMedia'],
    });
    return UserMapper.toResponseDtoArray(users);
  }

  async findOne(id: number): Promise<ResponseUserDto> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['socialMedia'],
    });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return UserMapper.toResponseDto(user);
  }

  async create(createUserDto: CreateUserDto): Promise<ResponseUserDto> {
    const user = this.userRepository.create(createUserDto);
    const savedUser = await this.userRepository.save(user);
    const userWithRelations = await this.userRepository.findOne({
      where: { id: savedUser.id },
      relations: ['socialMedia'],
    });
    return UserMapper.toResponseDto(userWithRelations!);
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<ResponseUserDto> {
    await this.userRepository.update(id, updateUserDto);
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['socialMedia'],
    });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return UserMapper.toResponseDto(user);
  }

  async replace(
    id: number,
    replaceUserDto: ReplaceUserDto,
  ): Promise<ResponseUserDto> {
    const existingUser = await this.userRepository.findOne({ where: { id } });
    if (!existingUser) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    await this.userRepository.update(id, replaceUserDto);
    const updatedUser = await this.userRepository.findOne({
      where: { id },
      relations: ['socialMedia'],
    });
    return UserMapper.toResponseDto(updatedUser!);
  }

  async delete(id: number): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    await this.userRepository.delete(id);
  }
}
