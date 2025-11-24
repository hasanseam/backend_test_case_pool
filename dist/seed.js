"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const faker_1 = require("@faker-js/faker");
const Product_1 = require("./models/Product");
const categories = ['Electronics', 'Apparel', 'Books', 'Home Goods', 'Sports'];
const seedProducts = [];
for (let i = 0; i < 100; i++) {
    seedProducts.push({
        name: faker_1.faker.commerce.productName(),
        price: parseFloat(faker_1.faker.commerce.price({ min: 10, max: 2000 })),
        category: categories[Math.floor(Math.random() * categories.length)],
    });
}
const seedDB = () => __awaiter(void 0, void 0, void 0, function* () {
    mongoose_1.default.set('strictQuery', true);
    yield mongoose_1.default.connect('mongodb://localhost:27017/product-api');
    yield Product_1.Product.deleteMany({});
    console.log('Products deleted!');
    yield Product_1.Product.insertMany(seedProducts);
    console.log('100 products have been seeded!');
    yield mongoose_1.default.connection.close();
});
seedDB().catch(err => {
    console.error(err);
    mongoose_1.default.connection.close();
});
