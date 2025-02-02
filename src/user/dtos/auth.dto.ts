import { UserType } from "@prisma/client";
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class SignUpDto {
    @IsString() 
    @IsNotEmpty()   
    name: string;

    //Cambodia Phone Regex
    @Matches(/[0-9]{8}$/)
    phone: string;

    @IsEmail()
    email: string;

    @IsString()
    @MinLength(5)
    password: string;

    @IsString()
    @IsOptional()
    @IsNotEmpty()
    productKey?: string;
}

export class SignInDto {
    @IsEmail()
    email: string;

    @IsString()
    password: string;
}

export class GenerateProductKeyDto {
    @IsEmail()
    email: string;

    @IsEnum(UserType)
    userType: UserType
}