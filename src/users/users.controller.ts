import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException,
  Query,
  HttpCode,
  HttpStatus,
  SerializeOptions,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';

@Controller('users')
@SerializeOptions({ strategy: 'excludeAll' })
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    const user = await this.usersService.createUser(createUserDto);
    return new UserResponseDto(user);
  }

  @Get()
  async findAll(
    @Query('correo_electronico') correo_electronico?: string,
    @Query('usuario_asignado') usuario_asignado?: string,
  ): Promise<UserResponseDto[] | UserResponseDto> {
    let user: any;
    
    if (correo_electronico) {
      user = await this.usersService.findByEmail(correo_electronico);
    } else if (usuario_asignado) {
      user = await this.usersService.findByUser(usuario_asignado);
    } else {
      const users = await this.usersService.findAll();
      return users.map(u => new UserResponseDto(u));
    }
    
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    return new UserResponseDto(user);
  }

  @Get(':id')
  async findJustOne(@Param('id') _id: string): Promise<UserResponseDto> {
    const user = await this.usersService.findOne(_id);
    if (!user) {
      throw new NotFoundException(`User with ID ${_id} not found.`);
    }
    return new UserResponseDto(user);
  }

  @Patch(':id')
  async update(
    @Param('id') _id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    const updatedUser = await this.usersService.update(_id, updateUserDto);
    return new UserResponseDto(updatedUser);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') _id: string): Promise<{ message: string }> {
    await this.usersService.remove(_id);
    return { message: 'Usuario eliminado correctamente' };
  }
}