import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common"
import { Reflector } from "@nestjs/core"
import * as jwt from "jsonwebtoken"
import { PrismaService } from "src/prisma/prisma.service"

interface JWTPlayloadType {
    name: string
    id: number
    iat: number
    exp: number 
}

@Injectable()
export class AuthGuard implements CanActivate  {
    constructor(private readonly reflector: Reflector, private readonly prismaService: PrismaService) {}

    async canActivate(context: ExecutionContext) {
        //1. Determine the UserTypes that can execute the called endpoint
        const roles = this.reflector.getAllAndOverride('roles', [
            //Get our metadata 
            context.getHandler(),
            context.getClass()
        ])
        //roles = ["ADMIN", "REALTOR"]

        //2. Grab the JWT from request header and verify UserTypes
        if(roles?.length) {
            const request = context.switchToHttp().getRequest()
            const token = request.headers?.authorization?.split("Bearer ")[1]
            try {
                const playload = (await jwt.verify(token, process.env.JSON_TOKEN_KEY)) as JWTPlayloadType

                //3. Database request to get user by id
                const user = await this.prismaService.user.findUnique({
                    where: {
                        id: playload.id   
                    }
                })

                if(!user) return false

                //4. Determine if the user has permission
                //Check if the user_type is "ADMIN" or "REALTOR"
                if(roles.includes(user.user_type)) return true

                return false 
            } catch (error) {
                return false
            }
        }  
    }
}