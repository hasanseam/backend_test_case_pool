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

  app.use((err: AppError, req: Request, res: Response, next: NextFunction) => {
    res.status(err.status || 500).json({
      message: err.message,
      status: err.status || 500,
    });
  });

  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

startServer();