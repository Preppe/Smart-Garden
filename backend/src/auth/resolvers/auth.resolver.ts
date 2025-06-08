import { Resolver, Mutation, Query, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { LoginInput } from '../dto/login.input';
import { RegisterInput } from '../dto/register.input';
import { AuthResponse } from '../dto/auth.response';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { User } from '../../users/entities/user.entity';

export interface GraphQLContext {
  req: {
    user?: User;
  };
}

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => AuthResponse)
  async register(@Args('registerInput') registerInput: RegisterInput): Promise<AuthResponse> {
    return this.authService.register(registerInput);
  }

  @Mutation(() => AuthResponse)
  async login(@Args('loginInput') loginInput: LoginInput): Promise<AuthResponse> {
    return this.authService.login(loginInput);
  }

  @Query(() => User)
  @UseGuards(JwtAuthGuard)
  async me(@Context() context: GraphQLContext): Promise<User> {
    const user = context.req.user;
    if (!user) {
      throw new Error('User not authenticated');
    }
    return user;
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard)
  async logout(@Context() context: GraphQLContext): Promise<boolean> {
    // In a real implementation, you might want to:
    // 1. Blacklist the token in Redis
    // 2. Remove the token from a token store
    // For now, we'll just return true as the client should discard the token
    return true;
  }
}
