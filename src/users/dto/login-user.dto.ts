import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginUserDto {
    
    @ApiProperty({ required: true, example: "abc@gmail.com" })
    @IsNotEmpty()
    @IsEmail()
    email: string;
    
    @ApiProperty({required: true})
    @IsString()
    @IsNotEmpty()
    password: string;
    
}
