import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "../entity/user.entity";
import { Repository } from "typeorm";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'your_jwt_secret_key',
    });
  }

  async validate(payload: { sub: string }) {
    console.log('JWT payload:', payload);
    const user = await this.userRepository.findOne({ where: { id: Number(payload.sub) } });
    console.log('User found for JWT:', user);
    if (!user) {
      console.log('No user found for JWT payload:', payload);
      throw new UnauthorizedException();
    }
    return user;
  }
}
