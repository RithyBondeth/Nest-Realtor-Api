import { BadRequestException, Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { UserCountDto, UserResponseDto } from './dtos/user.dto';
import { UserType } from '@prisma/client';

@Controller("users")
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    getAllUsers(
        @Query("userType") userType?: UserType
    ): Promise<UserResponseDto[]> {
        
        //Validate the userType
        if(userType && !Object.values(UserType).includes(userType as UserType)) {
            throw new BadRequestException(`Invalid userType: ${userType}`)
        }
        
        const filter = { userType }
    
        return this.userService.getAllUsers(filter)
    }

    @Get("count")
    getUserCount(
        @Query("userType") userType?: UserType
    ): Promise<UserCountDto> {

        //Validate the userType
        if(userType && !Object.values(UserType).includes(userType as UserType)) {
            throw new BadRequestException(`Invalid userType: ${userType}`)
        }

        const filter = { userType }
        
        return this.userService.getUserCount(filter)
    }

    @Get(":id") 
    getUserById(@Param('id', ParseIntPipe) id: number): Promise<UserResponseDto> {
        return this.userService.getUserById(id)
    }    
}