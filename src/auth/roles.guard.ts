import { Injectable, CanActivate, ExecutionContext, Inject, forwardRef } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
// import { InjectRepository } from "@nestjs/typeorm";
import { resolve } from "path";
import { Observable } from "rxjs";
import { ROLES_KEY } from "./roles.decorators";



@Injectable()
// export class RolesGuard implements CanActivate {
//     constructor(
//         private reflector: Reflector
//     ) { }

//     canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
//         const roles = this.reflector.get<string[]>('roles', context.getHandler());
//         if (!roles) {
//             return true;
//         }

//         const request = context.switchToHttp().getRequest();
//         const user = request?.user;

//         console.log("check user: ", user);

//         const userRole = user.roles[0];
//         console.log(userRole)

//         const hasRole = () => {
//           return roles.map((rRole) => {
//                 // console.log({rRole},"\n",roles);
//                 user?.roles?.find((role) => {
//                   return role?.type == rRole
//                 }) ? true : false;
//               })
//         };
//         // const hasRole = () => roles.indexOf(user.role) > -1;
//         console.log("request ========= ",request.permissionList)
//         if (hasRole()) {
//             let hasPermission: boolean = false;

//             if (hasRole()) {
//                 hasPermission = true;
//             };
//             return user && hasPermission;

//             // map((user: User) => {
//             //     const hasRole = () => roles.indexOf(user.role) > -1;
//             //     let hasPermission: boolean = false;

//             //     if (hasRole()) {
//             //         hasPermission = true;
//             //     };
//             //     return user && hasPermission;
//             // })
//         }
//     }
// }













export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    console.log("rRoles === ",requiredRoles)
    if (!requiredRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    return validateRequest(request, requiredRoles);
  }
}

async function validateRequest(request: any, requiredRoles: any){
  const user = await request?.user;
  // console.log("req===",request)
  console.log("user ===== ",user)
  const roles = user?.roles;
  console.log("roles === ", roles)
  
  const flag = await requiredRoles.map( (rRole) => {
    // console.log({rRole},"\n",roles);
    return roles?.find((role) => {
      return role?.type == rRole
    }) ? true : false;
    
    // return roles?.type?.includes(role)
  });
  // console.log(flag[0])
  // return flag[0];
  console.log("flag === ", flag[0])
  return true;
  // return new Promise<boolean>((resolve, reject) => {
  //   // resolve(flag[0]);
  //   resolve(true);
  // });
  // resolve();
  if(flag[0]){
    return true;
  }
  // else{
  //   return false;
  // }
  return true;
}