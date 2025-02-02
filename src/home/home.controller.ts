import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { HomeService } from './home.service';
import {
  CreateHomeDto,
  HomeResponseDto,
  InquireAboutHomeDto,
  UpdateHomeDto,
} from './dtos/home.dto';
import { PropertyType, UserType } from '@prisma/client';
import { User, UserInfo } from 'src/user/decorators/user.decorator';
import { AuthGuard } from 'src/guards/auth.guard';
import { Roles } from 'src/decorators/roles.decorator';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) {}

  @Get()
  getAllHomes(
    @Query('city') city?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('propertyType') propertyType?: PropertyType,
  ): Promise<HomeResponseDto[]> {
    //Filter by city, minPrice, maxPrice, and propertyType
    const price =
      minPrice || maxPrice
        ? {
            ...(minPrice && { gte: parseFloat(minPrice) }),
            ...(maxPrice && { lte: parseFloat(maxPrice) }),
          }
        : undefined;

    const filters = {
      ...(city && { city }),
      ...(price && { price }),
      ...(propertyType && { propertyType }),
    };

    return this.homeService.getAllHomes(filters);
  }
  //http://localhost:3000/home?city=PhnomPenh&minPrice=50000

  @Get(':id')
  getHome(@Param('id', ParseIntPipe) id: number): Promise<HomeResponseDto> {
    return this.homeService.getHome(id);
  }

  //Only realtor and admin can access this endpoint
  @Roles(UserType.ADMIN, UserType.REALTOR)
  @UseGuards(AuthGuard)
  @Post()
  createHome(@Body() body: CreateHomeDto, @User() user: UserInfo) {
    //console.log(user)
    //return "Create Home"
    return this.homeService.createHome(body, user.id);
  }

  //Only realtor and admin can access this endpoint
  @Roles(UserType.ADMIN, UserType.REALTOR)
  @UseGuards(AuthGuard)
  @Put(':id')
  async updateHome(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateHomeDto,
    @User() user: UserInfo,
  ) {
    //Find owner of home cuz only realtor can create home
    const realtor = await this.homeService.getRealtorByHomeId(id);

    if (realtor.id !== user.id)
      throw new UnauthorizedException('Only owner of the home can update');

    return this.homeService.updateHome(body, id);
  }

  //Only realtor and admin can access this endpoint
  @Roles(UserType.ADMIN, UserType.REALTOR)
  @UseGuards(AuthGuard)
  @Delete(':id')
  async deleteHome(
    @Param('id', ParseIntPipe) id: number,
    @User() user: UserInfo,
  ) {
    //Find owner of home cuz only realtor can delete home
    const realtor = await this.homeService.getRealtorByHomeId(id);

    if (realtor.id !== user.id)
      throw new UnauthorizedException('Only owner of the home can delete');

    return this.homeService.deleteHome(id);
  }

  @Roles(UserType.BYUER)
  @UseGuards(AuthGuard)
  @Post('/inquire/:id')
  inquireAboutHome(
    @Param('id', ParseIntPipe) homeId: number,
    @User() user: UserInfo,
    @Body() body: InquireAboutHomeDto,
  ) {
    return this.homeService.inquireAboutHome(user, homeId, body);
  }

  @Roles(UserType.REALTOR)
  @UseGuards(AuthGuard)
  @Get('/:id/messages')
  async getAllMessagesByHome(
    @Param('id', ParseIntPipe) homeId,
    @User() user: UserInfo,
  ) {
    const realtor = await this.homeService.getRealtorByHomeId(homeId);

    if (realtor.id !== user.id)
      throw new UnauthorizedException(
        'Only owner of home message can get message',
      );

    return this.homeService.getAllMessagesByHome(homeId);
  }
}
