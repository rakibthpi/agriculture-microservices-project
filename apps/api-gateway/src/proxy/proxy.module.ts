import {Module} from "@nestjs/common";
import {HttpModule} from "@nestjs/axios";
import {ConfigModule} from "@nestjs/config";
import {ProxyService} from "./proxy.service";
import {AuthProxyController} from "./controllers/auth-proxy.controller";
import {ProductProxyController} from "./controllers/product-proxy.controller";
import {OrderProxyController} from "./controllers/order-proxy.controller";

@Module({
  imports: [
    ConfigModule,
    HttpModule.register({
      timeout: 30000,
    }),
  ],
  controllers: [AuthProxyController, ProductProxyController, OrderProxyController],
  providers: [ProxyService],
})
export class ProxyModule {}
