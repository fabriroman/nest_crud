import { JwtService } from '@nestjs/jwt';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { SignupDto } from './dtos/signup.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dtos/login.dto';
import { RefreshTokenDto } from './dtos/refresh-token.dto';
import { RefreshTokenService } from 'src/refresh-token/refresh-token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly refreshTokenService: RefreshTokenService,
  ) {}

  async signup(signupData: SignupDto) {
    const { email, password, firstName, lastName, phone } = signupData;

    //Check if email is in use
    const emailInUse = await this.usersService.existsEmail(email);
    if (emailInUse) {
      throw new BadRequestException('Email already in use');
    }

    // Create user
    const newUser = await this.usersService.create({
      email,
      password: password,
      firstName,
      lastName,
      phone,
    });

    // Assign default role
    await this.usersService.assignRoleByName(newUser.id, "user");

    return newUser;
  }

  async login(credentials: LoginDto) {
    const { email, password } = credentials;

    //Find if user exists by email
    const user = await this.usersService.findByEmailForAuth(email);
    if (!user) {
      throw new UnauthorizedException('Wrong credentials');
    }

    //Compare entered password with existing password
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Wrong credentials');
    }

    //Generate JWT token and refresh token
    const tokens = await this.generateUserTokens(user.id);
    return {
      ...tokens,
      userId: user.id,
    };
  }

  async generateUserTokens(userId: number) {
    return {
      accessToken: await this.generateAccessToken(userId),
      refreshToken: (await this.refreshTokenService.createRefreshToken(userId)).token,
    };
  }

  async generateAccessToken(userId: number) {
    return this.jwtService.sign({ userId });
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    const { refreshToken, userId } = refreshTokenDto;
    
    try {
      const token = await this.refreshTokenService.findByTokenAndUserId(refreshToken, userId);

      if (token.expiresAt < new Date()) {
        await this.refreshTokenService.deleteById(token.id);
        throw new UnauthorizedException('Refresh token expired');
      }
      
      const newAccessToken = await this.generateAccessToken(userId);
      return {'newAccessToken': newAccessToken};
      
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new UnauthorizedException('Refresh token invalid or expired');
      }
      throw new UnauthorizedException('Error refreshing token');
    }
  }
}
