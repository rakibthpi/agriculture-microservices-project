import { Controller, All, Req, Body, Query, Headers } from '@nestjs/common';
import { Request } from 'express';
import { ProxyService } from '../proxy.service';

@Controller(['products', 'categories'])
export class ProductProxyController {
  constructor(private readonly proxyService: ProxyService) {}

  @All('*')
  async proxyToProduct(
    @Req() req: Request,
    @Body() body: any,
    @Query() query: any,
    @Headers() headers: any,
  ) {
    const path = `/api${req.path}`;
    const proxyHeaders: Record<string, string> = {};

    if (headers.authorization) {
      proxyHeaders['Authorization'] = headers.authorization;
    }

    return this.proxyService.proxyRequest(
      this.proxyService.productServiceUrl,
      path,
      req.method as any,
      body,
      proxyHeaders,
      query,
    );
  }
}
