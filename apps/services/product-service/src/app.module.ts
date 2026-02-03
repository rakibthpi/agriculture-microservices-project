import {Module} from "@nestjs/common";
import {ConfigModule, ConfigService} from "@nestjs/config";
import {TypeOrmModule} from "@nestjs/typeorm";
import {CategoriesModule} from "./categories/categories.module";
import {ProductsModule} from "./products/products.module";
import {Category} from "./categories/entities/category.entity";
import {Product} from "./products/entities/product.entity";

@Module({
  imports: [
    // Environment configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
    }),

    // Database connection
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get("DATABASE_HOST", "localhost"),
        port: configService.get("DATABASE_PORT", 5432),
        username: configService.get("DATABASE_USER", "postgres"),
        password: configService.get("DATABASE_PASSWORD", "1234"),
        database: configService.get("DATABASE_NAME", "postgres"),
        entities: [Category, Product],
        synchronize: configService.get("NODE_ENV") === "development",
        logging: configService.get("NODE_ENV") === "development",
      }),
    }),

    // Feature modules
    CategoriesModule,
    ProductsModule,
  ],
})
export class AppModule {}
