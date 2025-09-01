import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Patch,
  Put,
  HttpCode,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResponseUserDto } from './dto/response-user.dto';
import { ReplaceUserDto } from './dto/replace-user.dto';
import { PositiveIntPipe } from '../pipes/positive-int.pipe';
import { ResponseRoleDto } from '../roles/dto/response-role.dto';
import { Roles } from 'src/security/decorators/roles.decorator';
import { AuthenticationGuard } from 'src/security/guards/authentication.guard';
import { AuthorizationGuard } from 'src/security/guards/authorization.guard';
import { OwnsResourceUserGuard } from 'src/security/guards/owns.resource.user.guard';
import { Request } from 'express';

@Controller('/api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Roles(['admin'])
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Get()
  async getUsers(): Promise<ResponseUserDto[]> {
    return this.usersService.findAll();
  }

  @Roles(['admin', 'user'])
  @UseGuards(AuthenticationGuard, AuthorizationGuard, OwnsResourceUserGuard)
  @Get(':id')
  async getUser(
    @Param('id', PositiveIntPipe) id: number,
    @Req() request: Request & { userId: number; userRoles: string[] },
  ): Promise<ResponseUserDto> {
    const actor = { userId: request.userId, roles: request.userRoles };
    return this.usersService.findOne(id, actor);
  }

  @Roles(['admin'])
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<ResponseUserDto> {
    return this.usersService.create(createUserDto);
  }

  @Roles(['admin', 'user'])
  @UseGuards(AuthenticationGuard, AuthorizationGuard, OwnsResourceUserGuard)
  @Put(':id')
  async replaceUser(
    @Param('id', PositiveIntPipe) id: number,
    @Body() replaceUserDto: ReplaceUserDto,
    @Req() request: Request & { userId: number; userRoles: string[] },
  ): Promise<ResponseUserDto> {
    const actor = { userId: request.userId, roles: request.userRoles };
    return this.usersService.replace(id, replaceUserDto, actor);
  }

  @Roles(['admin', 'user'])
  @UseGuards(AuthenticationGuard, AuthorizationGuard, OwnsResourceUserGuard)
  @Patch(':id')
  async updateUser(
    @Param('id', PositiveIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
    @Req() request: Request & { userId: number; userRoles: string[] },
  ): Promise<ResponseUserDto> {
    const actor = { userId: request.userId, roles: request.userRoles };
    return this.usersService.update(id, updateUserDto, actor);
  }

  @Roles(['admin'])
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteUser(@Param('id', PositiveIntPipe) id: number): Promise<void> {
    return this.usersService.delete(id);
  }

  // Role management endpoints
  @Roles(['admin'])
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Post(':id/roles/:roleId')
  @HttpCode(HttpStatus.OK)
  async assignRole(
    @Param('id', PositiveIntPipe) id: number,
    @Param('roleId', PositiveIntPipe) roleId: number,
  ): Promise<ResponseUserDto> {
    await this.usersService.assignRole(id, roleId);
    return this.usersService.findOne(id);
  }

  @Roles(['admin'])
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Delete(':id/roles/:roleId')
  @HttpCode(HttpStatus.OK)
  async removeRole(
    @Param('id', PositiveIntPipe) id: number,
    @Param('roleId', PositiveIntPipe) roleId: number,
  ): Promise<ResponseUserDto> {
    await this.usersService.removeRole(id, roleId);
    return this.usersService.findOne(id);
  }

  @Roles(['admin'])
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Get(':id/roles')
  async getUserRoles(
    @Param('id', PositiveIntPipe) id: number,
  ): Promise<ResponseRoleDto[]> {
    return this.usersService.getUserRoles(id);
  }
}
