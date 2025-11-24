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
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.getProductById = exports.getProducts = exports.createProduct = void 0;
const Product_1 = require("./Product");
const AppError_1 = require("./AppError");
const createProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, price, category } = req.body;
        if (!name || !price || !category) {
            throw new AppError_1.AppError('Missing required fields', 400);
        }
        if (price <= 0) {
            throw new AppError_1.AppError('Price must be greater than 0', 400);
        }
        const product = yield Product_1.Product.create({ name, price, category });
        res.status(201).json(product);
    }
    catch (error) {
        next(error);
    }
});
exports.createProduct = createProduct;
const getProducts = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { page = 1, limit = 10, category, minPrice, maxPrice } = req.query;
        const query = {};
        if (category) {
            query.category = category;
        }
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) {
                query.price.$gte = minPrice;
            }
            if (maxPrice) {
                query.price.$lte = maxPrice;
            }
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
    catch (error) {
        next(error);
    }
});
exports.getProducts = getProducts;
const getProductById = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield Product_1.Product.findById(req.params.id);
        if (!product) {
            throw new AppError_1.AppError('Product not found', 404);
        }
        res.json(product);
    }
    catch (error) {
        next(error);
    }
});
exports.getProductById = getProductById;
const updateProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, price, category } = req.body;
        if (price !== undefined && price <= 0) {
            throw new AppError_1.AppError('Price must be greater than 0', 400);
        }
        const product = yield Product_1.Product.findByIdAndUpdate(id, { name, price, category }, { new: true });
        if (!product) {
            throw new AppError_1.AppError('Product not found', 404);
        }
        res.json(product);
    }
    catch (error) {
        next(error);
    }
});
exports.updateProduct = updateProduct;
const deleteProduct = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield Product_1.Product.findByIdAndDelete(req.params.id);
        if (!product) {
            throw new AppError_1.AppError('Product not found', 404);
        }
        res.status(204).send();
    }
    catch (error) {
        next(error);
    }
});
exports.deleteProduct = deleteProduct;
