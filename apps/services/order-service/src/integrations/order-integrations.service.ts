import {Injectable, Logger} from "@nestjs/common";
import {HttpService} from "@nestjs/axios";
import {ConfigService} from "@nestjs/config";
import {firstValueFrom} from "rxjs";

@Injectable()
export class OrderIntegrationsService {
  private readonly logger = new Logger(OrderIntegrationsService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  private get productServiceUrl() {
    return this.configService.get("PRODUCT_SERVICE_URL") || "http://localhost:3002";
  }

  private get authServiceUrl() {
    return this.configService.get("AUTH_SERVICE_URL") || "http://localhost:3001";
  }

  async validateProduct(productId: string) {
    try {
      const response = await firstValueFrom(this.httpService.get(`${this.productServiceUrl}/products/${productId}`));
      return response.data;
    } catch (error: any) {
      this.logger.error(`Failed to validate product ${productId}: ${error.message}`);
      return null;
    }
  }

  async updateProductStock(productId: string, quantity: number, operation: "add" | "subtract" | "set") {
    try {
      const response = await firstValueFrom(
        this.httpService.patch(`${this.productServiceUrl}/products/${productId}/stock`, {
          quantity,
          operation,
        }),
      );
      return response.data;
    } catch (error: any) {
      this.logger.error(`Failed to update stock for product ${productId}: ${error.message}`);
      return null;
    }
  }

  async validateUser(userId: string) {
    try {
      // In a real scenario, this might be an internal endpoint in Auth Service
      // For now, we can check health or a specific internal profile check
      const response = await firstValueFrom(this.httpService.get(`${this.authServiceUrl}/auth/health`));
      return response.data.success;
    } catch (error: any) {
      this.logger.error(`Failed to validate user ${userId}: ${error.message}`);
      return false;
    }
  }
}
