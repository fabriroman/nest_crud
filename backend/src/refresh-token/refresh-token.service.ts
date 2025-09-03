import { Injectable, NotFoundException } from '@nestjs/common';
import { RefreshToken } from 'src/entities/refresh-token.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class RefreshTokenService {
  constructor(
    @InjectRepository(RefreshToken)
    private refreshTokenRepository: Repository<RefreshToken>,
  ) {}

  async createRefreshToken(userId: number) {
    const token = uuidv4();
    const refreshToken = this.refreshTokenRepository.create({
      token,
      user: { id: userId },
      expiresAt: new Date(
        Date.now() + Number(process.env.REFRESH_TOKEN_EXPIRATION_TIME ?? 1 * 60 * 60 * 1000)
      ),
    });
    return this.refreshTokenRepository.save(refreshToken);
  }

  async findByTokenAndUserId(token: string, userId: number) {
    const refreshToken = await this.refreshTokenRepository.findOne(
        { where: { token: token, user: { id: userId }}, relations: ['user']},
    );
    if (!refreshToken) {
      throw new NotFoundException('Invalid refresh token');
    }
    return refreshToken;
  }

  async deleteById(id: number) {
    return this.refreshTokenRepository.delete({ id: id });
  }
}

