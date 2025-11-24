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
const supertest_1 = __importDefault(require("supertest"));
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
const product_routes_1 = __importDefault(require("../routes/product.routes"));
const AppError_1 = require("../middleware/AppError");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api/products', product_routes_1.default);
// 404 handler
app.all('*', (req, res, next) => {
    next(new AppError_1.AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
// Global error handler
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        message: err.message,
        status: err.status || 500,
    });
});
let mongoServer;
beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
    mongoServer = yield mongodb_memory_server_1.MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    yield mongoose_1.default.connect(mongoUri);
}));
afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.disconnect();
    yield mongoServer.stop();
}));
afterEach(() => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoose_1.default.connection.db.dropDatabase();
}));
describe('Product API', () => {
    it('should create a new product', () => __awaiter(void 0, void 0, void 0, function* () {
        const newProduct = { name: 'Laptop', price: 1200, category: 'Electronics' };
        const res = yield (0, supertest_1.default)(app).post('/api/products').send(newProduct);
        expect(res.status).toBe(201);
        expect(res.body.name).toBe(newProduct.name);
        expect(res.body.price).toBe(newProduct.price);
        expect(res.body.category).toBe(newProduct.category);
    }));
    it('should return 400 when creating product with missing fields', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).post('/api/products').send({ price: 100 });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('\"name\" is required');
    }));
    it('should return 400 when creating product with invalid price', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).post('/api/products').send({ name: 'Test', price: 0, category: 'Cat' });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('\"price\" must be greater than 0');
    }));
    it('should get all products (paginated)', () => __awaiter(void 0, void 0, void 0, function* () {
        const product = { name: 'Book', price: 25, category: 'Books' };
        yield (0, supertest_1.default)(app).post('/api/products').send(product);
        const res = yield (0, supertest_1.default)(app).get('/api/products');
        expect(Array.isArray(res.body.data)).toBe(true);
        expect(res.body.data.length).toBe(1);
        expect(res.body.total).toBe(1);
        expect(res.body.page).toBe(1);
        expect(res.body.pages).toBe(1);
        expect(res.body.data[0].name).toBe(product.name);
    }));
    it('should get a single product by ID', () => __awaiter(void 0, void 0, void 0, function* () {
        const product = { name: 'Headphones', price: 150, category: 'Electronics' };
        const created = yield (0, supertest_1.default)(app).post('/api/products').send(product);
        const res = yield (0, supertest_1.default)(app).get(`/api/products/${created.body._id}`);
        expect(res.status).toBe(200);
        expect(res.body.name).toBe(product.name);
    }));
    it('should return 404 for non-existent product', () => __awaiter(void 0, void 0, void 0, function* () {
        const fakeId = new mongoose_1.default.Types.ObjectId();
        const res = yield (0, supertest_1.default)(app).get(`/api/products/${fakeId}`);
        expect(res.status).toBe(404);
        expect(res.body.message).toBe('Product not found');
    }));
    it('should update a product partially', () => __awaiter(void 0, void 0, void 0, function* () {
        const created = yield (0, supertest_1.default)(app).post('/api/products').send({ name: 'Old', price: 50, category: 'Cat' });
        const update = { price: 100 };
        const res = yield (0, supertest_1.default)(app).patch(`/api/products/${created.body._id}`).send(update);
        expect(res.status).toBe(200);
        expect(res.body.price).toBe(update.price);
        expect(res.body.name).toBe('Old'); // unchanged
    }));
    it('should return 400 when updating with invalid price', () => __awaiter(void 0, void 0, void 0, function* () {
        const created = yield (0, supertest_1.default)(app).post('/api/products').send({ name: 'Old', price: 50, category: 'Cat' });
        const res = yield (0, supertest_1.default)(app).patch(`/api/products/${created.body._id}`).send({ price: -10 });
        expect(res.status).toBe(400);
        expect(res.body.message).toBe('\"price\" must be greater than 0');
    }));
    it('should return 404 when updating non-existent product', () => __awaiter(void 0, void 0, void 0, function* () {
        const fakeId = new mongoose_1.default.Types.ObjectId();
        const res = yield (0, supertest_1.default)(app).patch(`/api/products/${fakeId}`).send({ price: 100 });
        expect(res.status).toBe(404);
        expect(res.body.message).toBe('Product not found');
    }));
    it('should delete a product', () => __awaiter(void 0, void 0, void 0, function* () {
        const created = yield (0, supertest_1.default)(app).post('/api/products').send({ name: 'DeleteMe', price: 50, category: 'Cat' });
        const resDelete = yield (0, supertest_1.default)(app).delete(`/api/products/${created.body._id}`);
        expect(resDelete.status).toBe(204);
        const resGet = yield (0, supertest_1.default)(app).get(`/api/products/${created.body._id}`);
        expect(resGet.status).toBe(404);
    }));
    it('should return 404 for invalid route', () => __awaiter(void 0, void 0, void 0, function* () {
        const res = yield (0, supertest_1.default)(app).get('/api/product/1');
        expect(res.status).toBe(404);
        expect(res.body.message).toContain("Can't find /api/product/1 on this server!");
    }));
});
