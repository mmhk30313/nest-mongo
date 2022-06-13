import { Controller, Get, Post, Body, Patch, Param, Delete, UseFilters } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { HttpExceptionFilter } from 'src/error_handler/http-exception.filter';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthService } from 'src/auth/auth.service';

@Controller('users')
@ApiTags("CRUD-OPERATION-IN-USER")
export class UsersController {
  constructor(
    private authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  // @UseFilters(new HttpExceptionFilter())
  @ApiOperation({ summary: 'Sign up a user', description: 'Create a user with proper data value' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login a user', description: 'Login a user with proper data value' })
  login(@Body() loginDto: LoginUserDto) {
    return this.authService.login(loginDto);
    // return this.usersService.login(loginDto?.email, loginDto?.password);
  }

  @Get()
  @ApiOperation({summary: "Find Users", description: "Find All Users"})
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
