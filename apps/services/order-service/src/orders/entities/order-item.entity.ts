import {Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn} from "typeorm";
import {Order} from "./order.entity";

@Entity("order_items")
export class OrderItem {
  @PrimaryGeneratedColumn("uuid")
  id!: string;

  @Column({name: "order_id"})
  orderId!: string;

  @ManyToOne(() => Order, (order) => order.items)
  @JoinColumn({name: "order_id"})
  order!: Order;

  @Column({name: "product_id"})
  productId!: string;

  @Column({name: "product_name"})
  productName!: string;

  @Column({name: "product_image", nullable: true})
  productImage!: string;

  @Column()
  quantity!: number;

  @Column({default: "kg"})
  unit!: string;

  @Column({name: "unit_price", type: "decimal", precision: 10, scale: 2})
  unitPrice!: number;

  @Column({name: "total_price", type: "decimal", precision: 10, scale: 2})
  totalPrice!: number;

  @CreateDateColumn({name: "created_at"})
  createdAt!: Date;
}
