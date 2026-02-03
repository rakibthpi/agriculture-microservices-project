import {Controller, All, Req, Body, Query, Headers} from "@nestjs/common";
import {Request} from "express";
import {ProxyService} from "../proxy.service";

@Controller("orders")
export class OrderProxyController {
  constructor(private readonly proxyService: ProxyService) {}

  @All("*")
  async proxyToOrder(@Req() req: Request, @Body() body: any, @Query() query: any, @Headers() headers: any) {
    const path = `${req.baseUrl}${req.path}`;
    const proxyHeaders: Record<string, string> = {};

    if (headers.authorization) {
      proxyHeaders["Authorization"] = headers.authorization;
    }
    if (headers["x-user-id"]) {
      proxyHeaders["x-user-id"] = headers["x-user-id"];
    }

    return this.proxyService.proxyRequest(
      this.proxyService.orderServiceUrl,
      path,
      req.method as any,
      body,
      proxyHeaders,
      query,
    );
  }
}
