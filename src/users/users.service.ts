import { Injectable, HttpException, HttpStatus, Response } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';
import { AdminUpdateUserDto } from './dto/admin-update-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  
  async create(user: CreateUserDto) {
    try {
      const saltRounds = 10;
      const hash = bcrypt.hashSync(user.password, saltRounds);
      user.password = hash;
      user.role = ['Client'];
      const createdUser = new this.userModel(user);
      return await createdUser.save();
    } catch (err) {
      return new HttpException(err?.message, HttpStatus.BAD_REQUEST);
    }
  }

  async login(email: string, password: string) {
    try {
      const user = await this.userModel.findOne({ email });
      if (!user) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      const isValid = bcrypt.compareSync(password, user.password);
      if (!isValid) {
        throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
      }
      return await this.userModel.findOne({ email }).select('-password');
    } catch (err) {
      return new HttpException(err?.message, HttpStatus.BAD_REQUEST);
    }
  }

  async findAll() {
    return await this.userModel.find({});
  }

  async findOne(id: string) {
    return await this.userModel.findById(id);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return this.userModel.findByIdAndUpdate(id, updateUserDto);
  }

  async remove(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    console.log("user ==user_service== ", user);
    await this.userModel.deleteOne({_id: id});
    return {
      message: 'User deleted',
      user,
      status: HttpStatus.OK,
    };
  }

  async findOneAuth(email: string) {
    console.log("email ==user_service== ", email);
    // const user = await this.userModel.findOne({ email});
    // console.log("user ==user_service== ", user);
    // return user;
    const user = await this.userModel.aggregate([
      { $match: { email } },
      // { $project: { password: 0 } },
    ]);
    console.log("user ==user_service_aggregate== ", user);
    return user[0];
  }

  async updateUserRoleByAdmin(user_email: string, body: AdminUpdateUserDto) {    
    // const user_update_res = await this.userModel.findOne({email: user_email});
    try {
      const user_update_res = await this.userModel.findOneAndUpdate({email: user_email}, { ...body });
      if (!user_update_res) {
        return new HttpException('User not found', HttpStatus.NOT_FOUND);
      }  
      return await this.userModel.findOne({email: user_email}).select('-password');
    } catch (error) {
      return new HttpException(error?.message, HttpStatus.BAD_REQUEST);
    }
  }
}
