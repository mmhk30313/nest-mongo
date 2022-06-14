import { 
    // ApiProperty, 
    // ApiPropertyOptional, 
    OmitType 
} from "@nestjs/swagger";
// import { IsEmail, IsNotEmpty, IsString } from "class-validator";
import { CreateUserDto } from "src/users/dto/create-user.dto";
export class AuthLoginDto extends  OmitType(CreateUserDto, ['role', "mobile","name", "age", "address", "avatar"] as const){
    // @ApiProperty({ required: true, example: "mmhk@gmail.com" })
    // @IsNotEmpty()
    // @IsEmail()
    // email: string;
    
    // @ApiProperty({required: true})
    // @IsString()
    // @IsNotEmpty()
    // password: string;
    
} 