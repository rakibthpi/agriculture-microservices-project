import {DataSource} from "typeorm";
import {Category} from "../categories/entities/category.entity";
import {Product} from "../products/entities/product.entity";
import {dataSourceOptions} from "./data-source";

async function seed() {
  const dataSource = new DataSource(dataSourceOptions);
  await dataSource.initialize();

  const categoryRepository = dataSource.getRepository(Category);
  const productRepository = dataSource.getRepository(Product);

  const categories = [
    {name: "Rice & Grains", description: "Freshly harvested rice and other grains"},
    {name: "Vegetables", description: "Fresh organic vegetables"},
    {name: "Fruits", description: "Seasonal fresh fruits"},
    {name: "Spices", description: "Pure and aromatic spices"},
  ];

  const savedCategories = [];
  for (const cat of categories) {
    let category = await categoryRepository.findOneBy({name: cat.name});
    if (!category) {
      category = categoryRepository.create(cat);
      category = await categoryRepository.save(category);
      console.log(`✅ Category created: ${cat.name}`);
    }
    savedCategories.push(category);
  }

  const products = [
    {
      name: "Premium Basmati Rice",
      description: "Long-grain aromatic basmati rice",
      price: 120,
      stock: 500,
      unit: "kg",
      category: savedCategories[0],
    },
    {
      name: "Organic Spinach",
      description: "Fresh organic leafy spinach",
      price: 30,
      stock: 50,
      unit: "bunch",
      category: savedCategories[1],
    },
    {
      name: "Fresh Mangoes",
      description: "Sweet and juice seasonal mangoes",
      price: 150,
      stock: 100,
      unit: "kg",
      category: savedCategories[2],
    },
    {
      name: "Black Pepper Powder",
      description: "Pure ground black pepper",
      price: 80,
      stock: 200,
      unit: "100g",
      category: savedCategories[3],
    },
  ];

  for (const prod of products) {
    let product = await productRepository.findOneBy({name: prod.name});
    if (!product) {
      product = productRepository.create(prod);
      await productRepository.save(product);
      console.log(`✅ Product created: ${prod.name}`);
    }
  }

  await dataSource.destroy();
}

seed().catch((error) => {
  console.error("❌ Seeding failed:", error);
  process.exit(1);
});
