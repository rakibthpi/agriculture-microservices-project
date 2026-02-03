import {Injectable, HttpException, Logger} from "@nestjs/common";
import {ConfigService} from "@nestjs/config";
import axios, {AxiosRequestConfig, Method} from "axios";

@Injectable()
export class ProxyService {
  private readonly logger = new Logger(ProxyService.name);

  constructor(private readonly configService: ConfigService) {}

  get authServiceUrl(): string {
    return this.configService.get("AUTH_SERVICE_URL", "http://localhost:3001");
  }

  get productServiceUrl(): string {
    return this.configService.get("PRODUCT_SERVICE_URL", "http://localhost:3002");
  }

  get orderServiceUrl(): string {
    return this.configService.get("ORDER_SERVICE_URL", "http://localhost:3003");
  }

  async proxyRequest(
    serviceUrl: string,
    path: string,
    method: Method,
    data?: any,
    headers?: Record<string, string>,
    query?: Record<string, any>,
  ): Promise<any> {
    const url = `${serviceUrl}${path}`;

    const config: AxiosRequestConfig = {
      method,
      url,
      data,
      params: query,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      timeout: parseInt(this.configService.get("REQUEST_TIMEOUT", "30000"), 10),
    };

    try {
      if (this.configService.get("LOG_REQUESTS") === "true") {
        this.logger.log(`Proxying ${method} ${url}`);
      }

      const response = await axios(config);
      return response.data;
    } catch (error: any) {
      this.logger.error(`Proxy error: ${error.message}`);

      if (error.response) {
        throw new HttpException(error.response.data || {message: "Service error"}, error.response.status);
      }

      throw new HttpException({success: false, message: "Service unavailable"}, 503);
    }
  }
}
