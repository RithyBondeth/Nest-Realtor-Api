import { Controller, Post, Body, Param, ParseEnumPipe, UnauthorizedException, Get} from '@nestjs/common';
import { AuthService } from './auth.service';
import { GenerateProductKeyDto, SignInDto, SignUpDto } from '../dtos/auth.dto';
import { UserType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { User, UserInfo } from '../decorators/user.decorator';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}

    @Post('/signup/:userType')
    async signUp(@Body() body: SignUpDto, @Param('userType', new ParseEnumPipe(UserType)) userType: UserType) {
        
        //Trying to signup as Realtor or Admin
        if(userType !== UserType.BYUER) {
            if(!body.productKey) {
                throw new UnauthorizedException();
            }

            //Generate new product key and compare with product key that user input
            const validProductKey = `${body.email}-${userType}-${process.env.PRODUCT_KEY_SECRET}`;

            const isValidProductKey = await bcrypt.compare(validProductKey, body.productKey);

            if(!isValidProductKey) {
                throw new UnauthorizedException();
            }
        }

        return this.authService.signUp(body, userType);
    }

    @Post('/signin')
    signIn(@Body() body: SignInDto) {
        return this.authService.signIn(body);
    }

    @Post("/key")
    generateProductKey(@Body() body: GenerateProductKeyDto) {
        return this.authService.generateProductKey(body.email, body.userType);
    }

    @Get("/me")
    getMe(@User() user: UserInfo) {
        return user
    }
}