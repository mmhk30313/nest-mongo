import { Controller, Get, Post, Body, Patch, Param, Delete, UseFilters, UseGuards, Query, Req, Res, HttpException, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { HttpExceptionFilter } from 'src/error_handler/http-exception.filter';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthService } from 'src/auth/auth.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorators';
import { Role } from 'src/auth/roles.enum';
import { AuthLoginDto } from 'src/auth/dto/auth.dto';
import { AdminUpdateUserDto } from './dto/admin-update-user.dto';

// @ApiTags("CRUD-OPERATION-IN-USER")
@Controller('users')
export class UsersController {
  constructor(
    private authService: AuthService,
    private readonly usersService: UsersService,
  ) {}
    
  @ApiTags("Login")
  @Post('login')
  @ApiOperation({ summary: 'Login a user', description: 'Login a user with proper data value' })
  login(@Body() body: AuthLoginDto) {
    console.log('body ==== ', body);
    
    return this.authService.login(body);
  }

  @ApiTags("User Signup")
  @Post()
  // @UseFilters(new HttpExceptionFilter())
  @ApiOperation({ summary: 'Sign up a user', description: 'Create a user with proper data value' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
  
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin, Role.Client, Role.Blogger)
  @ApiTags("CRUD-OPERATION-IN-USER")
  @Get()
  @ApiOperation({summary: "Find Users", description: "Find All Users"})
  findAll() {
    return this.usersService.findAll();
  }
  
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiTags("CRUD-OPERATION-IN-USER")
  @Get(':id')
  @ApiOperation({summary: "Find User", description: "Find A User By His/Her Id"})
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }
  
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @ApiTags("CRUD-OPERATION-IN-USER")
  @Patch('update')
  @ApiOperation({summary: "Update User", description: "Update User By His/Her Id From Token"})
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  update(@Req() req: any, @Body() updateUserDto: UpdateUserDto) {
    const {user} = req?.user
    const { id } = user;
    console.log({id});
    
    return this.usersService.update(id, updateUserDto);
  }
  
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiTags("CRUD-OPERATION-IN-USER")
  @Delete(':id')
  @ApiOperation({summary: "Delete User", description: "Delete User By His/Her Id From Token"})
  remove(@Param('id') id: string, @Req() req: any) {
    // console.log("user ======> ", req.user);
    const {user} = req?.user
    const { id: admin_id } = user;
    console.log({admin_id});
    
    if(admin_id === id) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }else{
      return this.usersService.remove(id);
    }
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.Admin)
  @ApiTags("Admin Actions")
  @Patch('admin/role')
  @ApiOperation({summary: "Update User Role By Admin", description: "Admin can update User Role"})
  updateRole(@Query('user_email') user_email: string, @Body() body: AdminUpdateUserDto) {    
    return this.usersService.updateUserRoleByAdmin(user_email, body);
  }

}
