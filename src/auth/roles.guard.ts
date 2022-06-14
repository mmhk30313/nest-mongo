import { Injectable, CanActivate, ExecutionContext, Inject, forwardRef, HttpException, HttpStatus } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { resolve } from "path";
import { Observable } from "rxjs";
import { jwtConstants } from "./constants";
import { ROLES_KEY } from "./roles.decorators";



@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    console.log("Required Roles === ", requiredRoles)
    if (!requiredRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const token = request?.headers?.authorization?.split(" ")[1];
    if (!token) {
      throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED);
      // return false;
    }
    request.user = this.jwtService.decode(token);
    // request.user = this.jwtService.verify(token);
    // console.log("token === ", token)
    // console.log("request ========= ", request.rawHeaders[9].split(" ")[1]);
    return validateRequest(request, requiredRoles);
  }
}

async function validateRequest(request: any, requiredRoles: any){
  const {user} = request?.user;
  // console.log("req===",request)
  console.log("user ===== ", user)
  const roles = user?.role;
  // console.log("roles === ", roles)
  if(await roles?.filter(Set.prototype.has, new Set(requiredRoles))?.length > 0 ){
    return true;
  }
  return false;
  
  // const hasRole = await roles?.filter(Set.prototype.has, new Set(requiredRoles))?.length > 0 || false;
  // console.log("hasRole === ", hasRole);

  // let flag = false;
  // await requiredRoles.map(async (rRole: string) => {
    // console.log({rRole},"\n",roles);
    // return roles?.find((role) => {
    //   return role?.type == rRole
    // }) ? true : false;
    // if(roles?.includes(rRole)){
    //   console.log("ck => ", roles?.includes(rRole));
    //   // flag = true;
    //   return roles?.includes(rRole);
    // }
  // });
  // console.log(flag[0])
  // return flag[0];
  // console.log("flag === ", flag)
  
  // return new Promise<boolean>((resolve, reject) => {
  //   // resolve(flag[0]);
  //   resolve(true);
  // });
  // resolve();
  
}