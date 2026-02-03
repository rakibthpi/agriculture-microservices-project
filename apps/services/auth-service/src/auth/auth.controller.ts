import {Controller, Post, Body, Get, Put, UseGuards, Request} from "@nestjs/common";
import {AuthService} from "./auth.service";
import {RegisterDto} from "./dto/register.dto";
import {LoginDto} from "./dto/login.dto";
import {RefreshTokenDto} from "./dto/refresh-token.dto";
import {UpdateUserDto} from "../users/dto/update-user.dto";
import {JwtAuthGuard} from "./guards/jwt-auth.guard";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("register")
  async register(@Body() registerDto: RegisterDto) {
    const result = await this.authService.register(registerDto);
    return {
      success: true,
      data: result,
      message: "Registration successful",
    };
  }

  @Post("login")
  async login(@Body() loginDto: LoginDto) {
    const result = await this.authService.login(loginDto);
    return {
      success: true,
      data: result,
      message: "Login successful",
    };
  }

  @Get("profile")
  @UseGuards(JwtAuthGuard)
  async getProfile(@Request() req: any) {
    const user = await this.authService.getProfile(req.user.id);
    return {
      success: true,
      data: user,
    };
  }

  @Put("profile")
  @UseGuards(JwtAuthGuard)
  async updateProfile(@Request() req: any, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.authService.updateProfile(req.user.id, updateUserDto);
    return {
      success: true,
      data: user,
      message: "Profile updated successfully",
    };
  }

  @Post("refresh")
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    // In a real app, we would verify the token first to get the sub (userId)
    // without using the guard since the access token is expired.
    const result = await this.authService.refreshTokens(null as any, refreshTokenDto.refreshToken);
    return {
      success: true,
      data: result,
    };
  }

  @Post("logout")
  @UseGuards(JwtAuthGuard)
  async logout(@Request() req: any) {
    await this.authService.logout(req.user.id);
    return {
      success: true,
      message: "Logout successful",
    };
  }

  @Get("health")
  healthCheck() {
    return {
      success: true,
      message: "Auth Service is running",
      timestamp: new Date().toISOString(),
    };
  }
}
