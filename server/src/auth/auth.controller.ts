import {
  Body,
  Controller,
  Post,
  ConflictException,
  BadRequestException,
  Get,
  Query,
  NotFoundException,
  Param,
  Put,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';

@Controller('auth') // Base route for all endpoints in this controller
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // Register endpoint
  @Post('register')
  async register(@Body() registerDto: RegisterDto) {
    try {
      await this.authService.register(registerDto);
      return {
        message:
          'User registered successfully. Please check your email to verify your account.',
      };
    } catch (error) {
      if (error instanceof ConflictException) {
        throw new ConflictException('User already exists');
      }
      throw new BadRequestException('Registration failed');
    }
  }

  @Put('user/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: { name?: string; profileImage?: string },
  ) {
    try {
      const user = await this.authService.updateUser(+id, updateUserDto);
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('User not found');
      }
      throw new BadRequestException('Failed to update user');
    }
  }

  // Email verification endpoint (updated to POST)
  @Post('verify') // Changed from @Get to @Post
  async verifyEmail(@Body('token') token: string) {
    try {
      const user = await this.authService.verifyEmail(token);
      return { message: 'Email verified successfully.', user };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('User not found');
      }
      throw new BadRequestException('Invalid or expired token');
    }
  }

  // Fetch user data by ID
  @Get('user/:id')
  async getUser(@Param('id') id: string) {
    try {
      const user = await this.authService.getUserById(+id);
      return user;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException('User not found');
      }
      throw new BadRequestException('Failed to fetch user data');
    }
  }
}
