import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from 'src/users/dto/login-user.dto';
import { jwtConstants } from './constants';

@Injectable()
export class AuthService {
  constructor( 
    private readonly usersService: UsersService,
    private jwtService: JwtService
      
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOneAuth(email);
    if(user){
        const myPlaintextPassword = password;
        const hashPassword = user.password;
        const isMatchedPassword = await bcrypt.compare(myPlaintextPassword, hashPassword); 
        if(isMatchedPassword){
            const myUser = { 
                id: user.id,
                email: user.email,
                name: user.name,
                password: user.password,
                mobile: user?.mobile || "123",
                role: user?.role || "1"
            }
            // console.log('myUser ==== ',myUser);
            
            const payload = { user: myUser};
            // const payload = { id: myUser.id, email: myUser.email };
            // console.log({payload});
            try{
              const access_token = this.jwtService.sign(
                payload,
                {
                  secret: jwtConstants.secret,
                  expiresIn: '3600s'
                  // expiresIn: '10s'
                },
              );
              console.log('access_token ==== ',access_token);
              return {
                  user: myUser,
                  access_token,
              };
            } catch(err){
              console.log('err ==== ',err);
              return {
                  user: myUser,
                  access_token: '',
              };
            }
                
                    
            // return user;
        }
    }
    return null;
  }

  async login(user: LoginUserDto) {
    //   console.log(user)
    const { email, password } = user;
    const loggedInUser = await this.validateUser(email, password);
    // console.log("m-user ==== ",loggedInUser)
    // const payload = { email: myUser.email, sub: myUser.password };
    // console.log(payload);
    return loggedInUser;
    // return {
    //   user: loggedInUser
    //   // access_token: loggedInUser.access_token
    // };
  }
  
}
