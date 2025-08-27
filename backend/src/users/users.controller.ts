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
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResponseUserDto } from './dto/response-user.dto';
import { ReplaceUserDto } from './dto/replace-user.dto';
import { PositiveIntPipe } from '../pipes/positive-int.pipe';
import { ResponseRoleDto } from '../roles/dto/response-role.dto';
import { AuthenticationGuard } from 'src/guards/authentication.guards';
import { AuthorizationGuard } from 'src/guards/authorization.guards';
import { Roles } from 'src/decorators/roles.decorator';

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
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Get(':id')
  async getUser(
    @Param('id', PositiveIntPipe) id: number,
  ): Promise<ResponseUserDto> {
    return this.usersService.findOne(id);
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
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Put(':id')
  async replaceUser(
    @Param('id', PositiveIntPipe) id: number,
    @Body() replaceUserDto: ReplaceUserDto,
  ): Promise<ResponseUserDto> {
    return this.usersService.replace(id, replaceUserDto);
  }

  @Roles(['admin', 'user'])
  @UseGuards(AuthenticationGuard, AuthorizationGuard)
  @Patch(':id')
  async updateUser(
    @Param('id', PositiveIntPipe) id: number,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<ResponseUserDto> {
    return this.usersService.update(id, updateUserDto);
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
