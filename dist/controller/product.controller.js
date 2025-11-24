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
exports.deleteProduct = exports.updateProduct = exports.getProductById = exports.getProducts = exports.createProduct = void 0;
const Product_1 = require("../models/Product");
const AppError_1 = require("../middleware/AppError");
const joi_1 = __importDefault(require("joi"));
// Joi schemas
const createProductSchema = joi_1.default.object({
    name: joi_1.default.string().required(),
    price: joi_1.default.number().greater(0).required(),
    category: joi_1.default.string().required(),
});
const updateProductSchema = joi_1.default.object({
    name: joi_1.default.string().optional(),
    price: joi_1.default.number().greater(0).optional(),
    category: joi_1.default.string().optional(),
}).min(1); // At least one field must be provided
// Create a product
const createProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error, value } = createProductSchema.validate(req.body);
        if (error)
            throw new AppError_1.AppError(error.details[0].message, 400);
        const product = yield Product_1.Product.create(value);
        res.status(201).json(product);
    }
    catch (err) {
        next(err);
    }
});
exports.createProduct = createProduct;
// Get all products with pagination & filters
const getProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = 1, limit = 10, category, minPrice, maxPrice } = req.query;
        const query = {};
        if (category)
            query.category = category;
        if (minPrice != null || maxPrice != null) {
            query.price = {};
            if (minPrice != null)
                query.price.$gte = Number(minPrice);
            if (maxPrice != null)
                query.price.$lte = Number(maxPrice);
        }
        const products = yield Product_1.Product.find(query)
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit));
        const total = yield Product_1.Product.countDocuments(query);
        res.json({
            data: products,
            total,
            page: Number(page),
            pages: Math.ceil(total / Number(limit)),
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getProducts = getProducts;
// Get a single product by ID
const getProductById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield Product_1.Product.findById(req.params.id);
        if (!product)
            throw new AppError_1.AppError('Product not found', 404);
        res.json(product);
    }
    catch (err) {
        next(err);
    }
});
exports.getProductById = getProductById;
// Update a product partially
const updateProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { error, value } = updateProductSchema.validate(req.body);
        if (error)
            throw new AppError_1.AppError(error.details[0].message, 400);
        const product = yield Product_1.Product.findByIdAndUpdate(req.params.id, value, { new: true });
        if (!product)
            throw new AppError_1.AppError('Product not found', 404);
        res.json(product);
    }
    catch (err) {
        next(err);
    }
});
exports.updateProduct = updateProduct;
// Delete a product
const deleteProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield Product_1.Product.findByIdAndDelete(req.params.id);
        if (!product)
            throw new AppError_1.AppError('Product not found', 404);
        res.status(204).send();
    }
    catch (err) {
        next(err);
    }
});
exports.deleteProduct = deleteProduct;
