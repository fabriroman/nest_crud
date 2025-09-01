import { JwtService } from '@nestjs/jwt';
import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { SignupDto } from './dtos/signup.dto';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dtos/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
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

    //Generate JWT token
    const accessToken = await this.generateUserToken(user.id);
    return {
      accessToken,
      userId: user.id,
    };
  }

  async generateUserToken(userId: number) {
    return this.jwtService.sign({ userId });
  }
}
