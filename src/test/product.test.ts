import request from 'supertest';
import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import productRoutes from '../routes/product.routes';
import { AppError } from '../middleware/AppError';

const app = express();
app.use(express.json());
app.use('/api/products', productRoutes);

// 404 handler
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handler
app.use((err: AppError, req: Request, res: Response, next: NextFunction) => {
  res.status(err.status || 500).json({
    message: err.message,
    status: err.status || 500,
  });
});

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await mongoose.connection.db.dropDatabase();
});

describe('Product API', () => {
  it('should create a new product', async () => {
    const newProduct = { name: 'Laptop', price: 1200, category: 'Electronics' };
    const res = await request(app).post('/api/products').send(newProduct);

    expect(res.status).toBe(201);
    expect(res.body.name).toBe(newProduct.name);
    expect(res.body.price).toBe(newProduct.price);
    expect(res.body.category).toBe(newProduct.category);
  });

  it('should return 400 when creating product with missing fields', async () => {
    const res = await request(app).post('/api/products').send({ price: 100 });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('\"name\" is required');
  });

  it('should return 400 when creating product with invalid price', async () => {
    const res = await request(app).post('/api/products').send({ name: 'Test', price: 0, category: 'Cat' });
    expect(res.status).toBe(400);
    expect(res.body.message).toBe('\"price\" must be greater than 0');
  });

  it('should get all products (paginated)', async () => {
    const product = { name: 'Book', price: 25, category: 'Books' };
    await request(app).post('/api/products').send(product);

    const res = await request(app).get('/api/products');

    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBe(1);
    expect(res.body.total).toBe(1);
    expect(res.body.page).toBe(1);
    expect(res.body.pages).toBe(1);
    expect(res.body.data[0].name).toBe(product.name);
  });

  it('should get a single product by ID', async () => {
    const product = { name: 'Headphones', price: 150, category: 'Electronics' };
    const created = await request(app).post('/api/products').send(product);
    const res = await request(app).get(`/api/products/${created.body._id}`);

    expect(res.status).toBe(200);
    expect(res.body.name).toBe(product.name);
  });

  it('should return 404 for non-existent product', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).get(`/api/products/${fakeId}`);
    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Product not found');
  });

  it('should update a product partially', async () => {
    const created = await request(app).post('/api/products').send({ name: 'Old', price: 50, category: 'Cat' });
    const update = { price: 100 };
    const res = await request(app).patch(`/api/products/${created.body._id}`).send(update);

    expect(res.status).toBe(200);
    expect(res.body.price).toBe(update.price);
    expect(res.body.name).toBe('Old'); // unchanged
  });

  it('should return 400 when updating with invalid price', async () => {
    const created = await request(app).post('/api/products').send({ name: 'Old', price: 50, category: 'Cat' });
    const res = await request(app).patch(`/api/products/${created.body._id}`).send({ price: -10 });

    expect(res.status).toBe(400);
    expect(res.body.message).toBe('\"price\" must be greater than 0');
  });

  it('should return 404 when updating non-existent product', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app).patch(`/api/products/${fakeId}`).send({ price: 100 });

    expect(res.status).toBe(404);
    expect(res.body.message).toBe('Product not found');
  });

  it('should delete a product', async () => {
    const created = await request(app).post('/api/products').send({ name: 'DeleteMe', price: 50, category: 'Cat' });
    const resDelete = await request(app).delete(`/api/products/${created.body._id}`);
    expect(resDelete.status).toBe(204);

    const resGet = await request(app).get(`/api/products/${created.body._id}`);
    expect(resGet.status).toBe(404);
  });

  it('should return 404 for invalid route', async () => {
    const res = await request(app).get('/api/product/1');
    expect(res.status).toBe(404);
    expect(res.body.message).toContain("Can't find /api/product/1 on this server!");
  });
});
