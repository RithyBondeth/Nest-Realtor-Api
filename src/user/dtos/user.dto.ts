import { UserType } from "@prisma/client"
import { Exclude, Expose } from "class-transformer"
import { IsNotEmpty, IsNumber, IsPositive, IsString } from "class-validator"

export class UserResponseDto {
    @IsNumber()
    @IsPositive()
    id: number

    @IsString()
    @IsNotEmpty()
    name: string

    @IsString()
    @IsNotEmpty()
    email: string
   
    @IsString()
    @IsNotEmpty()
    phone: string

    @Exclude()
    user_type: UserType
    @Expose({name: "userType"})
    userType() {
        return this.user_type
    }

    constructor(partial: Partial<UserResponseDto>) {
        Object.assign(this, partial);
    }
}

export class UserCountDto {
    @IsNumber()
    @IsPositive()
    user_count: number   
}