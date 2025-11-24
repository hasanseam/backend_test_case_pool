import express, { Request, Response, NextFunction } from 'express';
import productRoutes from './routes/product.routes';
import { AppError } from './middleware/AppError';
import connectDB from './config/db';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

//basic boilerplate if there is env. as it is small prject i dont have any env
dotenv.config();

const app = express();

const startServer = async () => {
  await connectDB();

  app.use(express.json());

  // --- Rate Limiting Middleware ---
  // This will apply to all routes that start with /api
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: 'Too many requests from this IP, please try again after 15 minutes.',
  });

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