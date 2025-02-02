import { CallHandler, ExecutionContext, NestInterceptor } from "@nestjs/common";
import * as jwt from "jsonwebtoken"

export class UserInterceptor implements NestInterceptor {
    async intercept(context: ExecutionContext, handler: CallHandler) {
        const request = context.switchToHttp().getRequest()
        const token = request?.headers?.authorization?.split("Bearer ")[1] //Get token from header request without Bearer
        const user = await jwt.decode(token) //Convert from jwt token to user

        request.user = user
          
        return handler.handle()
    }
}