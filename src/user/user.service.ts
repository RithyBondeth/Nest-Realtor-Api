import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserCountDto, UserResponseDto } from './dtos/user.dto';
import { UserType } from '@prisma/client';

interface GetAllUsersParams {
    userType?: UserType
}

// interface UserCountParams {
//     userType?: UserType
// }

type UserCountParams = GetAllUsersParams

@Injectable()
export class UserService {
    constructor(private readonly prismaService: PrismaService) {}

    async getAllUsers(filter: GetAllUsersParams): Promise<UserResponseDto[]> {
        const users = await this.prismaService.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                user_type: true,
            },
            where: {
                user_type: filter.userType
            }
        })

        if(!users.length) throw new NotFoundException("User not found")

        return users.map((user) => new UserResponseDto(user))
    }   

    async getUserById(id: number): Promise<UserResponseDto> {
        const user = await this.prismaService.user.findUnique({
            where: {
                id: id
            },
            select: {
                id: true,
                name: true,
                email: true,
                user_type: true
            }
        })   

        if(!user) throw new NotFoundException(`User with id ${id} not found`)

        return new UserResponseDto(user)
    }

    async getUserCount(filter: UserCountParams): Promise<UserCountDto> {
        const userCount = await this.prismaService.user.count({
            where: {
                user_type: filter.userType
            }
        })

        return { user_count: userCount }
    }
}