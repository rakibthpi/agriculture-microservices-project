import {DataSource} from "typeorm";
import {User, UserRole} from "../users/entities/user.entity";
import * as bcrypt from "bcrypt";
import {dataSourceOptions} from "./data-source";

async function seed() {
  const dataSource = new DataSource(dataSourceOptions);
  await dataSource.initialize();

  const userRepository = dataSource.getRepository(User);

  const adminEmail = process.env.SUPER_ADMIN_EMAIL || "admin@agrimarket.com";
  const existingAdmin = await userRepository.findOneBy({email: adminEmail});

  if (!existingAdmin) {
    const password = process.env.SUPER_ADMIN_PASSWORD || "Admin@123456";
    const hashedPassword = await bcrypt.hash(password, 10);

    const admin = userRepository.create({
      name: process.env.SUPER_ADMIN_NAME || "Super Admin",
      email: adminEmail,
      password: hashedPassword,
      role: UserRole.SUPER_ADMIN,
    });

    await userRepository.save(admin);
    console.log("✅ Super Admin created");
  } else {
    console.log("ℹ️ Super Admin already exists");
  }

  await dataSource.destroy();
}

seed().catch((error) => {
  console.error("❌ Seeding failed:", error);
  process.exit(1);
});
