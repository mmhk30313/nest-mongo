import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, Length } from "class-validator";

export class CreateUserDto {
    @ApiProperty({ required: true, example: "MMHK" })
    @IsNotEmpty()
    @IsString()
    name: string;
    
    @ApiProperty({ required: true, example: "abc@gmail.com" })
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @ApiProperty({ required: false, example: "+881521108858" })
    @IsString()
    mobile: string;

    // @ApiProperty({ required: true, example: "1" })
    @IsOptional()
    @IsNumber()
    @IsNotEmpty()
    role: string[];
    
    @ApiProperty({required: true})
    @IsString()
    @IsNotEmpty()
    password: string;
    
    @ApiProperty({required: false, example: 15})
    @IsNumber()
    @IsOptional()
    age: number;
    
    @ApiProperty({required: false, example: "avatar.png"})
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
