import { SetMetadata } from "@nestjs/common";
import { UserType } from "@prisma/client";

//["REALTOR", "ADMIN"]
export const Roles = (...roles: UserType[]) => SetMetadata('roles', roles)