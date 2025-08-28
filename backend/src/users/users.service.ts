import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
import { Role } from '../entities/role.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ReplaceUserDto } from './dto/replace-user.dto';
import { ResponseUserDto } from './dto/response-user.dto';
import { UserMapper } from './mappers/user.mapper';
import { RolesService } from '../roles/roles.service';
import { ResponseRoleDto } from '../roles/dto/response-role.dto';
import { RoleMapper } from '../roles/mappers/role.mapper';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  async findRoleByName(name: string): Promise<Role | null> {
    return this.roleRepository.findOne({ where: { name } });
  }
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    private rolesService: RolesService,
  ) {}

  async findAll(): Promise<ResponseUserDto[]> {
    const users = await this.userRepository.find({
      relations: ['socialMedia', 'roles'],
    });
    return UserMapper.toResponseDtoArray(users);
  }

  async findOne(id: number): Promise<ResponseUserDto> {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['socialMedia', 'roles'],
    });
    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }
    return UserMapper.toResponseDto(user);
  }

  async existsEmail(email: string): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['socialMedia', 'roles'],
    });
    if (!user) {
      return false;
    }
    return true;
  }

  async findByEmailForAuth(email: string): Promise<User | null> {
    const user = await this.userRepository.findOne({
      where: { email },
      relations: ['roles'],
    });
    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<ResponseUserDto> {
    // Hash password before saving
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const userData = { ...createUserDto, password: hashedPassword };

    const user = this.userRepository.create(userData);
    const savedUser = await this.userRepository.save(user);
    const userWithRelations = await this.userRepository.findOne({
      where: { id: savedUser.id },
      relations: ['socialMedia', 'roles'],
    });
    await this.assignRoleByName(savedUser.id, "user");
    return UserMapper.toResponseDto(userWithRelations!);
  }

  async assignRoleByName(userId: number, role: string): Promise<void> {
    const roleId = await this.rolesService.findByName(role);
    if (!roleId) {
      throw new NotFoundException(`Role with name ${role} not found`);
    }
    await this.assignRole(userId, roleId.id);
  }

  async update(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<ResponseUserDto> {
    // Hash password if it's being updated
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    await this.userRepository.update(id, updateUserDto);
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['socialMedia', 'roles'],
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

    // Hash password before updating
    const hashedPassword = await bcrypt.hash(replaceUserDto.password, 10);
    const userData = { ...replaceUserDto, password: hashedPassword };

    await this.userRepository.update(id, userData);
    const updatedUser = await this.userRepository.findOne({
      where: { id },
      relations: ['socialMedia', 'roles'],
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

  async assignRole(userId: number, roleId: number): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['roles'],
    });

    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    const role = await this.rolesService.findOne(roleId);
    if (!role) {
      throw new NotFoundException(`Role with id ${roleId} not found`);
    }

    // Check if user already has this role
    const hasRole = user.roles?.some((r) => r.id === roleId);
    if (hasRole) {
      return; // User already has this role
    }

    // Initialize roles array if it doesn't exist
    if (!user.roles) {
      user.roles = [];
    }

    // Add the complete role object to maintain proper relations
    const roleToAdd = await this.roleRepository.findOne({
      where: { id: roleId },
    });
    if (roleToAdd) {
      user.roles.push(roleToAdd);
      await this.userRepository.save(user);
    }
  }

  async removeRole(userId: number, roleId: number): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['roles'],
    });

    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    if (!user.roles || user.roles.length === 0) {
      return; // User has no roles to remove
    }

    // Check if user actually has this role
    const hasRole = user.roles.some((r) => r.id === roleId);
    if (!hasRole) {
      return; // User doesn't have this role
    }

    // Remove role from user
    user.roles = user.roles.filter((r) => r.id !== roleId);
    await this.userRepository.save(user);
  }

  async getUserRoles(userId: number): Promise<ResponseRoleDto[]> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['roles'],
    });

    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    // Use the RoleMapper to convert to DTOs
    return RoleMapper.toResponseDtoArray(user.roles || []);
  }
}
