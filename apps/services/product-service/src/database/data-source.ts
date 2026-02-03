import {DataSource, DataSourceOptions} from "typeorm";
import {config} from "dotenv";
import {Category} from "../categories/entities/category.entity";
import {Product} from "../products/entities/product.entity";

config();

export const dataSourceOptions: DataSourceOptions = {
  type: "postgres",
  host: process.env.DATABASE_HOST || "localhost",
  port: parseInt(process.env.DATABASE_PORT || "5432", 10),
  username: process.env.DATABASE_USER || "postgres",
  password: process.env.DATABASE_PASSWORD || "1234",
  database: process.env.DATABASE_NAME || "product_db",
  entities: [Category, Product],
  migrations: [__dirname + "/migrations/*.{ts,js}"],
  synchronize: false,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
