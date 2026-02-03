import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
} from "typeorm";
import {Product} from "../../products/entities/product.entity";

@Entity("categories")
export class Category {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({unique: true})
  name: string;

  @Column({unique: true})
  slug: string;

  @Column({type: "text", nullable: true})
  description: string;

  @Column({name: "image_url", nullable: true})
  imageUrl: string;

  @Column({name: "is_active", default: true})
  isActive: boolean;

  @Column({name: "display_order", default: 0})
  displayOrder: number;

  @CreateDateColumn({name: "created_at"})
  createdAt: Date;

  @UpdateDateColumn({name: "updated_at"})
  updatedAt: Date;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];

  @BeforeInsert()
  @BeforeUpdate()
  generateSlug() {
    if (this.name && !this.slug) {
      this.slug = this.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }
  }
}
