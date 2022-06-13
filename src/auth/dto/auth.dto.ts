import { ApiPropertyOptional, OmitType } from "@nestjs/swagger";
import { CreateUserDto } from "src/users/dto/create-user.dto";
export class AuthLoginDto extends  OmitType(CreateUserDto, ['role', "mobile","name"] as const){
    
} 