import {DataSource, DataSourceOptions} from "typeorm";
import {config} from "dotenv";
import {Order} from "../orders/entities/order.entity";
import {OrderItem} from "../orders/entities/order-item.entity";

config();

export const dataSourceOptions: DataSourceOptions = {
  type: "postgres",
  host: process.env.DATABASE_HOST || "localhost",
  port: parseInt(process.env.DATABASE_PORT || "5432", 10),
  username: process.env.DATABASE_USER || "postgres",
  password: process.env.DATABASE_PASSWORD || "1234",
  database: process.env.DATABASE_NAME || "order_db",
  entities: [Order, OrderItem],
  migrations: [__dirname + "/migrations/*.{ts,js}"],
  synchronize: false,
};

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;
