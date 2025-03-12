import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('api/data')
export class DataController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async getData() {
    const users = await this.prisma.user.findMany();
    return users;
  }
}
