import {Controller, Get} from "@nestjs/common";

@Controller("health")
export class HealthController {
  @Get()
  check() {
    return {
      success: true,
      message: "API Gateway is running",
      timestamp: new Date().toISOString(),
      services: {
        auth: process.env.AUTH_SERVICE_URL || "http://localhost:3001",
        product: process.env.PRODUCT_SERVICE_URL || "http://localhost:3002",
        order: process.env.ORDER_SERVICE_URL || "http://localhost:3003",
      },
    };
  }
}
