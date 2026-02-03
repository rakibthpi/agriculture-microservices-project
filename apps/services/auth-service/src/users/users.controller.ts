import {Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseUUIDPipe, Query} from "@nestjs/common";
import {UsersService} from "./users.service";
import {CreateUserDto} from "./dto/create-user.dto";
import {UpdateUserDto} from "./dto/update-user.dto";
import {JwtAuthGuard} from "../auth/guards/jwt-auth.guard";
import {RolesGuard} from "../auth/guards/roles.guard";
import {Roles} from "../auth/decorators/roles.decorator";
import {UserRole} from "./entities/user.entity";

@Controller("users")
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return {
      success: true,
      data: user,
      message: "User created successfully",
    };
  }

  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  async findAll(
    @Query("page") page?: number,
    @Query("limit") limit?: number,
    @Query("role") role?: UserRole,
    @Query("search") search?: string,
  ) {
    const result = await this.usersService.findAll({page, limit, role, search});
    return {
      success: true,
      ...result,
    };
  }

  @Get(":id")
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  async findOne(@Param("id", ParseUUIDPipe) id: string) {
    const user = await this.usersService.findOne(id);
    return {
      success: true,
      data: user,
    };
  }

  @Patch(":id")
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  async update(@Param("id", ParseUUIDPipe) id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.usersService.update(id, updateUserDto);
    return {
      success: true,
      data: user,
      message: "User updated successfully",
    };
  }

  @Delete(":id")
  @Roles(UserRole.SUPER_ADMIN)
  async remove(@Param("id", ParseUUIDPipe) id: string) {
    await this.usersService.remove(id);
    return {
      success: true,
      message: "User deleted successfully",
    };
  }

  @Patch(":id/role")
  @Roles(UserRole.SUPER_ADMIN)
  async updateRole(@Param("id", ParseUUIDPipe) id: string, @Body("role") role: UserRole) {
    const user = await this.usersService.updateRole(id, role);
    return {
      success: true,
      data: user,
      message: "User role updated successfully",
    };
  }

  @Patch(":id/deactivate")
  @Roles(UserRole.SUPER_ADMIN, UserRole.ADMIN)
  async deactivate(@Param("id", ParseUUIDPipe) id: string) {
    const user = await this.usersService.deactivate(id);
    return {
      success: true,
      data: user,
      message: "User deactivated successfully",
    };
  }
}
