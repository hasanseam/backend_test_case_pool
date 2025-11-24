import { Request, Response, NextFunction } from 'express';
import { Product } from '../models/Product';
import { AppError } from '../middleware/AppError';
import Joi from 'joi';

// Joi schemas
const createProductSchema = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().greater(0).required(),
  category: Joi.string().required(),
});

const updateProductSchema = Joi.object({
  name: Joi.string().optional(),
  price: Joi.number().greater(0).optional(),
  category: Joi.string().optional(),
}).min(1); // At least one field must be provided

// Create a product
export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error, value } = createProductSchema.validate(req.body);
    if (error) throw new AppError(error.details[0].message, 400);

    const product = await Product.create(value);
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

// Get all products with pagination & filters
export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { page = 1, limit = 10, category, minPrice, maxPrice } = req.query;
    const query: any = {};

    if (category) query.category = category;
    if (minPrice != null || maxPrice != null) {
      query.price = {};
      if (minPrice != null) query.price.$gte = Number(minPrice);
      if (maxPrice != null) query.price.$lte = Number(maxPrice);
    }

    const products = await Product.find(query)
      .limit(Number(limit))
      .skip((Number(page) - 1) * Number(limit));

    const total = await Product.countDocuments(query);

    res.json({
      data: products,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    next(err);
  }
};

// Get a single product by ID
export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) throw new AppError('Product not found', 404);
    res.json(product);
  } catch (err) {
    next(err);
  }
};

// Update a product partially
export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { error, value } = updateProductSchema.validate(req.body);
    if (error) throw new AppError(error.details[0].message, 400);

    const product = await Product.findByIdAndUpdate(req.params.id, value, { new: true });
    if (!product) throw new AppError('Product not found', 404);

    res.json(product);
  } catch (err) {
    next(err);
  }
};

// Delete a product
export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) throw new AppError('Product not found', 404);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
