import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { ResponseRoleDto } from './dto/response-role.dto';
import { Roles } from 'src/security/decorators/roles.decorator';
import { AuthenticationGuard } from 'src/security/guards/authentication.guard';
import { AuthorizationGuard } from 'src/security/guards/authorization.guard';

@Roles(['admin'])
@UseGuards(AuthenticationGuard, AuthorizationGuard)
@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  async create(@Body() createRoleDto: CreateRoleDto): Promise<ResponseRoleDto> {
    return this.rolesService.create(createRoleDto);
  }

  @Get()
  async findAll(): Promise<ResponseRoleDto[]> {
    return this.rolesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ResponseRoleDto> {
    return this.rolesService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateRoleDto: UpdateRoleDto,
  ): Promise<ResponseRoleDto> {
    return this.rolesService.update(+id, updateRoleDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string): Promise<void> {
    return this.rolesService.delete(+id);
  }
}
