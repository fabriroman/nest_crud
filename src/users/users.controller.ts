import { Body, Controller, Delete, Get, Param, Post, Patch, Put, HttpCode, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ResponseUserDto } from './dto/response-user.dto';
import { ReplaceUserDto } from './dto/replace-user.dto';
import { PositiveIntPipe } from '../pipes/positive-int.pipe';

@Controller('/api/users')
export class UsersController {

    constructor(private readonly usersService: UsersService) {}

    @Get()
    async getUsers(): Promise<ResponseUserDto[]> {
        return this.usersService.findAll();
    }

    @Get(':id')
    async getUser(@Param('id', PositiveIntPipe) id: number): Promise<ResponseUserDto> {
        return this.usersService.findOne(id);
    }

    @Post()
    @HttpCode(HttpStatus.CREATED)
    async createUser(@Body() createUserDto: CreateUserDto): Promise<ResponseUserDto> {
        return this.usersService.create(createUserDto);
    }

    @Put(':id')
    async replaceUser(@Param('id', PositiveIntPipe) id: number, @Body() replaceUserDto: ReplaceUserDto): Promise<ResponseUserDto> {
        return this.usersService.replace(id, replaceUserDto);
    }

    @Patch(':id')
    async updateUser(@Param('id', PositiveIntPipe) id: number, @Body() updateUserDto: UpdateUserDto): Promise<ResponseUserDto> {
        return this.usersService.update(id, updateUserDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteUser(@Param('id', PositiveIntPipe) id: number): Promise<void> {
        return this.usersService.delete(id);
    }

    
}
