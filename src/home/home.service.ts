import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { HomeResponseDto } from './dtos/home.dto';
import { PropertyType } from '@prisma/client';
import { UserInfo } from 'src/user/decorators/user.decorator';

interface GetAllHomesParams {
  city?: string;
  price?: {
    gte?: number;
    lte?: number;
  };
  propertyType?: PropertyType;
}

interface CreateHomeParams {
  address: string;
  numberOfBedrooms: number;
  numberOfBathrooms: number;
  city: string;
  price: number;
  landSize: number;
  propertyType: PropertyType;
  images: { url: string }[];
}

interface UpdateHomeParams {
  address?: string;
  numberOfBedrooms?: number;
  numberOfBathrooms?: number;
  city?: string;
  price?: number;
  landSize?: number;
  propertyType?: PropertyType;
}

interface InquireAboutHomeParams {
  message: string;
}

@Injectable()
export class HomeService {
  constructor(private readonly prismaService: PrismaService) {}

  async getAllHomes(filters: GetAllHomesParams): Promise<HomeResponseDto[]> {
    const homes = await this.prismaService.home.findMany({
      select: {
        id: true,
        address: true,
        city: true,
        price: true,
        propertyType: true,
        number_of_bathrooms: true,
        number_of_bedrooms: true,
        land_size: true,
        images: {
          select: {
            url: true,
          },
          take: 1,
        },
        realtor: {
          select: {
            id: true,
            name: true,
            email: true,
            user_type: true,
          },
        },
      },
      where: filters,
    });

    if (!homes.length) throw new NotFoundException('Home not found');

    return homes.map((home) => {
      const fetchHome = { ...home, image: home.images[0].url };
      delete fetchHome.images;
      return new HomeResponseDto(fetchHome);
    });
  }

  async getHome(id: number): Promise<HomeResponseDto> {
    const home = await this.prismaService.home.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        address: true,
        city: true,
        price: true,
        propertyType: true,
        number_of_bathrooms: true,
        number_of_bedrooms: true,
        land_size: true,
        images: true,
        realtor: {
          select: {
            id: true,
            name: true,
            email: true,
            user_type: true,
          },
        },
      },
    });

    if (!home) throw new NotFoundException();

    return new HomeResponseDto(home);
  }

  async createHome(body: CreateHomeParams, userId: number) {
    const newHome = await this.prismaService.home.create({
      data: {
        address: body.address,
        number_of_bathrooms: body.numberOfBathrooms,
        number_of_bedrooms: body.numberOfBedrooms,
        city: body.city,
        land_size: body.landSize,
        price: body.price,
        propertyType: body.propertyType,
        realtor_id: userId,
      },
    });

    const newHomeImages = body.images.map((image) => {
      return { ...image, home_id: newHome.id };
    });

    await this.prismaService.image.createMany({ data: newHomeImages });

    console.log(newHome);

    return new HomeResponseDto(newHome);
  }

  async updateHome(body: UpdateHomeParams, id: number) {
    const home = await this.prismaService.home.findUnique({
      where: {
        id: id,
      },
    });

    if (!home) throw new NotFoundException();

    const updatedHome = await this.prismaService.home.update({
      where: {
        id: id,
      },
      data: {
        address: body.address,
        city: body.city,
        price: body.price,
        propertyType: body.propertyType,
        number_of_bedrooms: body.numberOfBedrooms,
        number_of_bathrooms: body.numberOfBathrooms,
        land_size: body.landSize,
      },
    });

    return new HomeResponseDto(updatedHome);
  }

  async deleteHome(id: number) {
    // Delete all home's images via home_id
    await this.prismaService.image.deleteMany({
      where: {
        home_id: id,
      },
    });
    // Delete home
    await this.prismaService.home.delete({
      where: {
        id: id,
      },
    });
  }

  async getRealtorByHomeId(id: number) {
    const home = await this.prismaService.home.findUnique({
      where: {
        id: id,
      },
      select: {
        realtor: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    if (!home) throw new NotFoundException(`Home with id ${id} not found`);

    return home.realtor;
  }

  async inquireAboutHome(
    buyer: UserInfo,
    homeId: number,
    body: InquireAboutHomeParams,
  ) {
    const realtor = await this.getRealtorByHomeId(homeId);

    const newMessage = await this.prismaService.message.create({
      data: {
        realtor_id: realtor.id,
        buyer_id: buyer.id,
        home_id: homeId,
        message: body.message,
      },
    });

    return newMessage;
  }

  async getAllMessagesByHome(homeId: number) {
    const messages = await this.prismaService.message.findMany({
      where: {
        home_id: homeId,
      },
      select: {
        message: true,
        buyer: {
          select: {
            name: true,
            email: true,
            phone: true,
          },
        },
      },
    });

    return messages;
  }
}
