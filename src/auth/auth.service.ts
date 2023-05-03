import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/user.model';
import { UserService } from '../users/user.service';
import { LoginInput } from './dto/login.input';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(credentials: {
    email: string;
    password: string;
  }): Promise<User | null> {
    const user = await this.usersService.findByEmail(credentials.email);
    const { password } = credentials;
    const hash = user?.password;
    const isMatch = user ? await bcrypt.compare(password, hash) : false;
    if (user && isMatch) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = user;
      return result as User;
    }
    return null;
  }

  async login(user: LoginInput): Promise<{ access_token: string }> {
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
