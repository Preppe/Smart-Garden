import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { User } from '../entities/user.entity';
import { UsersService } from '../users.service';
import { CreateUserInput } from '../dto/create-user.input';
import { UpdateUserInput, UpdateProfileInput } from '../dto/update-user.input';
import { UserRole } from '../entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';

export interface GraphQLContext {
  req: {
    user?: User;
  };
}

@Resolver(() => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User])
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async users(): Promise<User[]> {
    return this.usersService.findAll();
  }

  @Query(() => User)
  @UseGuards(JwtAuthGuard)
  async user(@Args('id') id: string): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Query(() => User)
  @UseGuards(JwtAuthGuard)
  async me(@Context() context: GraphQLContext): Promise<User> {
    const userId = context.req.user?.id;
    if (!userId) {
      throw new Error('User not authenticated');
    }
    return this.usersService.findOne(userId);
  }

  @Mutation(() => User)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput): Promise<User> {
    return this.usersService.create(createUserInput);
  }

  @Mutation(() => User)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput): Promise<User> {
    return this.usersService.update(updateUserInput.id, updateUserInput);
  }

  @Mutation(() => User)
  @UseGuards(JwtAuthGuard)
  async updateProfile(@Args('updateProfileInput') updateProfileInput: UpdateProfileInput, @Context() context: GraphQLContext): Promise<User> {
    const userId = context.req.user?.id;
    if (!userId) {
      throw new Error('User not authenticated');
    }
    return this.usersService.updateProfile(userId, updateProfileInput);
  }

  @Mutation(() => Boolean)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  async removeUser(@Args('id') id: string): Promise<boolean> {
    return this.usersService.remove(id);
  }
}
