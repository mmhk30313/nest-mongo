import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { jwtConstants } from './constants';
import { AuthLoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor( 
    private readonly usersService: UsersService,
    private jwtService: JwtService,
      
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    console.log("email ==== ", email, "\npassword ==== ", password);
    
    const user = await this.usersService.findOneAuth(email);
    // console.log("user ==== ", user);
    
    if(user){
        const myPlaintextPassword = password;
        const hashPassword = user.password;
        const isMatchedPassword = await bcrypt.compare(myPlaintextPassword, hashPassword); 
        if(isMatchedPassword){
            const myUser = { 
                id: user.id || user?._id,
                email: user.email,
                name: user.name,
                password: user.password,
                role: user?.role,
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
                  // expiresIn: '60s' // Dile kaj kore
                  expiresIn: '2 days'
                },
              );
              console.log('access_token ==== ', access_token);
              delete myUser.password;
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

  async login(user: AuthLoginDto) {
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
