import express, { Request, Response, NextFunction } from 'express';
import productRoutes from './routes/product.routes';
import { AppError } from './middleware/AppError';
import connectDB from './config/db';
import dotenv from 'dotenv';

//basic boilerplate if there is env. as it is small prject i dont have any env
dotenv.config();

const app = express();

const startServer = async () => {
  await connectDB();

  app.use(express.json());

  //all rout declaration
  app.use('/api/products', productRoutes);

// Handle 404 for routes that are not found
app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.status || 500;
  const message = err.message || 'Internal Server Error';
  res.status(statusCode).json({
    message,
    status: statusCode,
  });
});

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();