import {Injectable, ConflictException, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import {User, UserRole} from "./entities/user.entity";
import {CreateUserDto} from "./dto/create-user.dto";
import {UpdateUserDto} from "./dto/update-user.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: {email: createUserDto.email},
    });

    if (existingUser) {
      throw new ConflictException("Email already exists");
    }

    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async findAll(query: {
    page?: number;
    limit?: number;
    role?: UserRole;
    search?: string;
  }): Promise<{data: User[]; total: number}> {
    const {page = 1, limit = 10, role, search} = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.userRepository.createQueryBuilder("user");

    if (role) {
      queryBuilder.andWhere("user.role = :role", {role});
    }

    if (search) {
      queryBuilder.andWhere("(user.name ILIKE :search OR user.email ILIKE :search)", {search: `%${search}%`});
    }

    queryBuilder.orderBy("user.createdAt", "DESC").skip(skip).take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return {data, total};
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOne({where: {id}});
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({where: {email}});
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);
    Object.assign(user, updateUserDto);
    return this.userRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findOne(id);
    await this.userRepository.remove(user);
  }

  async updateLastLogin(id: string): Promise<void> {
    await this.userRepository.update(id, {lastLogin: new Date()});
  }

  async findByRole(role: UserRole): Promise<User[]> {
    return this.userRepository.find({
      where: {role},
      order: {createdAt: "DESC"},
    });
  }

  async updateRole(id: string, role: UserRole): Promise<User> {
    const user = await this.findOne(id);
    user.role = role;
    return this.userRepository.save(user);
  }

  async deactivate(id: string): Promise<User> {
    const user = await this.findOne(id);
    user.isActive = false;
    return this.userRepository.save(user);
  }

  async count(): Promise<number> {
    return this.userRepository.count();
  }
}
