import { Injectable, HttpException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import  * as jwt from 'jsonwebtoken';

interface SignupParams {
    name: string,
    phone: string
    email: string,
    password: string,
}

interface SignInParams {
    email: string,
    password: string,
}

@Injectable()
export class AuthService {
    constructor(private readonly prismaService: PrismaService){}

    private generateJWT(name: string, id: number) {
        const token = jwt.sign({ name: name, id: id }, process.env.JSON_TOKEN_KEY, { expiresIn: 3600 })
        return token;
    }

    async signUp(body: SignupParams, userType: UserType) {
        const hashedPassword  = await bcrypt.hash(body.password, 10)

        const user = await this.prismaService.user.create({
            data: {
                name: body.name,
                phone: body.phone,
                email: body.email,
                password: hashedPassword,
                user_type: userType,
            }
        })

        return this.generateJWT(user.name, user.id);
    }

    async signIn(body: SignInParams) {
        const user = await this.prismaService.user.findUnique({
            where: {
                email: body.email
            }
        })

        if(!user) throw new HttpException("Invalid Credentials", 400);

        const hashedPassword = user.password;
        const isValidPassword = await bcrypt.compare(body.password, hashedPassword);

        if(!isValidPassword) throw new HttpException("Invalid Credentails", 400);
        
        return this.generateJWT(user.name, user.id);
    }

    generateProductKey(email: string, userType: UserType) {
        const string = `${email}-${userType}-${process.env.PRODUCT_KEY_SECRET}`

        return bcrypt.hash(string, 10);
    }
}
