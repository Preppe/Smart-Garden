import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './entities/user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput, UpdateProfileInput } from './dto/update-user.input';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserInput: CreateUserInput): Promise<User> {
    // Check if user with email already exists
    const existingUser = await this.userRepository.findOne({
      where: { email: createUserInput.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(createUserInput.password, saltRounds);

    // Create user entity
    const user = this.userRepository.create({
      ...createUserInput,
      password: hashedPassword,
    });

    return await this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.userRepository.findOne({
      where: { email },
    });
  }

  async update(id: string, updateUserInput: UpdateUserInput): Promise<User> {
    const user = await this.findOne(id);

    // Check if email is being changed and if it's already taken
    if (updateUserInput.email && updateUserInput.email !== user.email) {
      const existingUser = await this.findByEmail(updateUserInput.email);
      if (existingUser) {
        throw new ConflictException('Email already in use');
      }
    }

    // Update user
    Object.assign(user, updateUserInput);
    return await this.userRepository.save(user);
  }

  async updateProfile(userId: string, updateProfileInput: UpdateProfileInput): Promise<User> {
    const user = await this.findOne(userId);
    Object.assign(user, updateProfileInput);
    return await this.userRepository.save(user);
  }

  async remove(id: string): Promise<boolean> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
    return true;
  }

  async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  async updatePassword(userId: string, newPassword: string): Promise<User> {
    const user = await this.findOne(userId);
    const saltRounds = 12;
    user.password = await bcrypt.hash(newPassword, saltRounds);
    return await this.userRepository.save(user);
  }
}
