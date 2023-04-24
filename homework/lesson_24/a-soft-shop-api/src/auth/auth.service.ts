import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { UserEntity } from '../users/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(credentials: {
    email: string;
    password: string;
  }): Promise<UserEntity | null> {
    const user = await this.usersService.findOneByEmail(credentials.email);
    const { password } = credentials;
    const hash = user?.password;
    const isMatch = user ? await bcrypt.compare(password, hash) : false;
    if (user && isMatch) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result as UserEntity;
    }
    return null;
  }

  async login(user: UserEntity): Promise<{ access_token: string }> {
    return {
      access_token: this.jwtService.sign(user),
    };
  }

  async validateToken(token: string): Promise<boolean> {
    try {
      this.jwtService.verify(token);
      return true;
    } catch (error) {
      return false;
    }
  }
}
