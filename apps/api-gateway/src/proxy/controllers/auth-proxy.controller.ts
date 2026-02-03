import { Controller, All, Req, Res, Param, Body, Query, Headers } from '@nestjs/common';
import { Request, Response } from 'express';
import { ProxyService } from '../proxy.service';

@Controller('auth')
export class AuthProxyController {
  constructor(private readonly proxyService: ProxyService) {}

  @All('*')
  async proxyToAuth(
    @Req() req: Request,
    @Body() body: any,
    @Query() query: any,
    @Headers() headers: any,
  ) {
    const path = `/api/auth${req.path.replace('/auth', '')}`;
    const proxyHeaders: Record<string, string> = {};

    if (headers.authorization) {
      proxyHeaders['Authorization'] = headers.authorization;
    }

    return this.proxyService.proxyRequest(
      this.proxyService.authServiceUrl,
      path,
      req.method as any,
      body,
      proxyHeaders,
      query,
    );
  }
}
