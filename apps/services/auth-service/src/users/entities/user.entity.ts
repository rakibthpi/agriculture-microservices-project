import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BeforeInsert,
  BeforeUpdate,
} from "typeorm";
import * as bcrypt from "bcrypt";

export enum UserRole {
  SUPER_ADMIN = "super_admin",
  ADMIN = "admin",
  PRODUCT_MANAGER = "product_manager",
  USER = "user",
}

@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({unique: true})
  email: string;

  @Column()
  password: string;

  @Column()
  name: string;

  @Column({nullable: true})
  phone: string;

  @Column({name: "avatar_url", nullable: true})
  avatarUrl: string;

  @Column({
    type: "enum",
    enum: UserRole,
    default: UserRole.USER,
  })
  role: UserRole;

  @Column({name: "is_active", default: true})
  isActive: boolean;

  @Column({name: "email_verified", default: false})
  emailVerified: boolean;

  @Column({name: "last_login", type: "timestamp", nullable: true})
  lastLogin: Date;

  @Column({name: "refresh_token_hash", nullable: true})
  refreshTokenHash: string;

  @CreateDateColumn({name: "created_at"})
  createdAt: Date;

  @UpdateDateColumn({name: "updated_at"})
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    if (this.password && !this.password.startsWith("$2b$")) {
      const rounds = parseInt(process.env.BCRYPT_ROUNDS || "10", 10);
      this.password = await bcrypt.hash(this.password, rounds);
    }
  }

  async validatePassword(password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
  }

  toJSON() {
    const {password, ...result} = this as any;
    return result;
  }
}
