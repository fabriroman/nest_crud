import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities/user.entity';
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
import { ensureOwnershipOrAdmin } from 'src/security/ensure-ownership-or-admin';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private rolesService: RolesService,
  ) {}

  async findAll(): Promise<ResponseUserDto[]> {
    const users = await this.userRepository.find({
      relations: ['socialMedia', 'roles'],
    });
    return UserMapper.toResponseDtoArray(users);
  }

  async findOne(
    id: number,
    actor?: { userId: number; roles: string[] },
  ): Promise<ResponseUserDto> {
    if (actor) ensureOwnershipOrAdmin(actor, id);
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
    actor?: { userId: number; roles: string[] },
  ): Promise<ResponseUserDto> {
    if (actor) ensureOwnershipOrAdmin(actor, id);
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
    actor?: { userId: number; roles: string[] },
  ): Promise<ResponseUserDto> {
    if (actor) ensureOwnershipOrAdmin(actor, id);
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

    // Add the complete role object to maintain proper relations
    await this.userRepository.createQueryBuilder()
      .relation(User, "roles")
      .of(userId)
      .add(role.id);
  }

  async removeRole(userId: number, roleId: number): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    await this.userRepository.createQueryBuilder()
      .relation(User, 'roles')
      .of(userId)
      .remove(roleId);
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
