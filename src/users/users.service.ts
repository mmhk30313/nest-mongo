import { Injectable, HttpException, HttpStatus, Response } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}
  
  async create(user: CreateUserDto) {
    try {
      const saltRounds = 10;
      const hash = bcrypt.hashSync(user.password, saltRounds);
      user.password = hash;
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

  async remove(id: number) {
    return this.userModel.findByIdAndRemove(id);
  }

  async findOneAuth(email: string) {
    return await this.userModel.findOne({ email });
  }
}
