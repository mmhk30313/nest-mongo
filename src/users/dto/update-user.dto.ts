import { 
    OmitType,
    PartialType,
    PickType
} from '@nestjs/mapped-types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Role } from 'src/auth/roles.enum';
import { CreateUserDto } from './create-user.dto';

export class UpdateUserDto extends OmitType(CreateUserDto, ['password']) {
    @ApiProperty({ required: false, example: "MMHK" })
    @IsNotEmpty()
    @IsString()
    name: string;
    
    @ApiProperty({ required: false, example: "abc@gmail.com" })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({ required: false, example: "+881521108858" })
    @IsString()
    mobile: string;

    // @ApiProperty({ required: true, example: "1" })
    // @IsOptional()
    // @IsNumber()
    // @IsNotEmpty()
    // role: string[];
    
    @ApiProperty({required: false, })
    @IsString()
    password: string;
    
    @ApiProperty({required: false, example: 15})
    @IsNumber()
    @IsOptional()
    age: number;
    
    @ApiPropertyOptional()
    @IsString()
    @IsOptional()
    avatar: string;

    @ApiProperty({required: false, example: {
        street: "123 Main St",
        city: "Dhaka",
        state: "Bangladesh"
    }})
    @IsOptional()
    address: Object;
}
