import {
  Injectable,
  ConflictException,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import * as nodemailer from 'nodemailer';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async register(registerDto: RegisterDto) {
    const { email, password } = registerDto;

    console.log('Registering user with email:', email); // Debug log

    // Check if user already exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      console.log('User already exists:', email); // Debug log
      throw new ConflictException('User already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Password hashed successfully'); // Debug log

    // Generate a verification token
    const verificationToken = jwt.sign({ email }, process.env.JWT_SECRET!, {
      expiresIn: '1h',
    });
    console.log('Verification token generated:', verificationToken); // Debug log

    // Create the user in the database
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        verificationToken,
      },
    });
    console.log('User created successfully'); // Debug log

    // Send confirmation email
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Confirm your email',
      html: `
        <p>Please click the link below to confirm your email:</p>
        <a href="${process.env.BASE_URL}/auth/verify?token=${verificationToken}">Confirm Email</a>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log('Confirmation email sent'); // Debug log

    return user;
  }

  async verifyEmail(token: string) {
    let decoded: { email: string };
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as { email: string };
    } catch (error) {
      throw new BadRequestException('Invalid or expired token');
    }

    // Find the user by email
    const user = await this.prisma.user.findUnique({
      where: { email: decoded.email },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Update the user's verification status
    await this.prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationToken: { set: null }, // Clear the verification token
      },
    });

    return user;
  }

  async getUserById(id: number) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateUser(
    id: number,
    updateUserDto: { name?: string; profileImage?: string },
  ) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.prisma.user.update({
      where: { id },
      data: {
        name: updateUserDto.name,
        profileImage: updateUserDto.profileImage,
      },
    });
  }
}
