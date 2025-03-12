import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [AuthController], // Register the AuthController
  providers: [AuthService, PrismaService], // Register the AuthService and PrismaService
})
export class AuthModule {}
