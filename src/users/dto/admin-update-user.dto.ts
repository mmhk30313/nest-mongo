import { 
    OmitType,
    PartialType,
    PickType
} from '@nestjs/mapped-types';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEmail, IsNotEmpty, IsOptional } from 'class-validator';
import { AuthLoginDto } from 'src/auth/dto/auth.dto';
import { Role } from 'src/auth/roles.enum';
import { CreateUserDto } from './create-user.dto';

export class AdminUpdateUserDto extends PickType(CreateUserDto, ['role'] as const) {
    // @ApiProperty({ required: true, example: "abc@gmail.com" })
    // @IsNotEmpty()
    // @IsEmail()
    // email: string;
    
    @ApiProperty(
        { required: false, example: [...Object.values(Role)] }
    )
    @IsOptional()
    @IsArray()
    role: string[]
}
