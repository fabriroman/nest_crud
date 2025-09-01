import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../entities/role.entity';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ReplaceRoleDto } from './dto/replace-role.dto';
import { ResponseRoleDto } from './dto/response-role.dto';
import { RoleMapper } from './mappers/role.mapper';

@Injectable()
export class RolesService {
  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async getRolesByUserId(userId: number): Promise<ResponseRoleDto[]> {
    const roles = await this.roleRepository.find({
      where: { users: { id: userId } },
      relations: ['users'],
    });
    if (!roles || roles.length === 0) {
      throw new NotFoundException(`No roles found for user with id ${userId}`);
    }
    return RoleMapper.toResponseDtoArray(roles);
  }

  async findAll(): Promise<ResponseRoleDto[]> {
    const roles = await this.roleRepository.find();
    return RoleMapper.toResponseDtoArray(roles);
  }

  async findOne(id: number): Promise<ResponseRoleDto> {
    const role = await this.roleRepository.findOne({
      where: { id },
      relations: ['users'],
    });
    
    if (!role) {
      throw new NotFoundException(`Role with id ${id} not found`);
    }
    
    return RoleMapper.toResponseDto(role);
  }

  async findByName(name: string): Promise<Role | null> {
    return this.roleRepository.findOne({
      where: { name },
    });
  }

  async existsName(name: string): Promise<boolean> {
    const role = await this.roleRepository.findOne({
      where: { name },
    });
    return !!role;
  }

  async create(createRoleDto: CreateRoleDto): Promise<ResponseRoleDto> {
    // Check if role name already exists
    const existingRole = await this.findByName(createRoleDto.name);
    if (existingRole) {
      throw new ConflictException(`Role with name '${createRoleDto.name}' already exists`);
    }

    const role = this.roleRepository.create(createRoleDto);
    const savedRole = await this.roleRepository.save(role);
    return RoleMapper.toResponseDto(savedRole);
  }

  async update(id: number, updateRoleDto: UpdateRoleDto): Promise<ResponseRoleDto> {
    const existingRole = await this.roleRepository.findOne({ where: { id } });
    if (!existingRole) {
      throw new NotFoundException(`Role with id ${id} not found`);
    }

    // Check if new name conflicts with existing roles
    if (updateRoleDto.name && updateRoleDto.name !== existingRole.name) {
      const nameExists = await this.existsName(updateRoleDto.name);
      if (nameExists) {
        throw new ConflictException(`Role with name '${updateRoleDto.name}' already exists`);
      }
    }

    await this.roleRepository.update(id, updateRoleDto);
    const updatedRole = await this.roleRepository.findOne({ where: { id } });
    return RoleMapper.toResponseDto(updatedRole!);
  }

  async replace(id: number, replaceRoleDto: ReplaceRoleDto): Promise<ResponseRoleDto> {
    const existingRole = await this.roleRepository.findOne({ where: { id } });
    if (!existingRole) {
      throw new NotFoundException(`Role with id ${id} not found`);
    }

    // Check if new name conflicts with existing roles
    if (replaceRoleDto.name !== existingRole.name) {
      const nameExists = await this.existsName(replaceRoleDto.name);
      if (nameExists) {
        throw new ConflictException(`Role with name '${replaceRoleDto.name}' already exists`);
      }
    }

    await this.roleRepository.update(id, replaceRoleDto);
    const updatedRole = await this.roleRepository.findOne({ where: { id } });
    return RoleMapper.toResponseDto(updatedRole!);
  }

  async delete(id: number): Promise<void> {
    const role = await this.roleRepository.findOne({ 
      where: { id },
      relations: ['users']
    });
    
    if (!role) {
      throw new NotFoundException(`Role with id ${id} not found`);
    }

    // Check if role is assigned to any users
    if (role.users && role.users.length > 0) {
      throw new ConflictException(`Cannot delete role '${role.name}' as it is assigned to ${role.users.length} user(s)`);
    }

    await this.roleRepository.delete(id);
  }

}
