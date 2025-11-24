import mongoose from 'mongoose';
import { faker } from '@faker-js/faker';
import { Product, IProduct } from './models/Product';

const categories = ['Electronics', 'Apparel', 'Books', 'Home Goods', 'Sports'];
const seedProducts: Partial<IProduct>[] = [];

for (let i = 0; i < 100; i++) {
  seedProducts.push({
    name: faker.commerce.productName(),
    price: parseFloat(faker.commerce.price({ min: 10, max: 2000 })),
    category: categories[Math.floor(Math.random() * categories.length)],
  });
}

const seedDB = async () => {
  mongoose.set('strictQuery', true);

  await mongoose.connect('mongodb://localhost:27017/product-api');

  await Product.deleteMany({});
  console.log('Products deleted!');

  await Product.insertMany(seedProducts);
  console.log('100 products have been seeded!');

  await mongoose.connection.close();
};

seedDB().catch(err => {
  console.error(err);
  mongoose.connection.close();
});