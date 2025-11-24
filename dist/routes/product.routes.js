"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = require("../controller/product.controller");
const router = (0, express_1.Router)();
//all product routes
router.post('/', product_controller_1.createProduct);
router.get('/', product_controller_1.getProducts);
router.get('/:id', product_controller_1.getProductById);
router.patch('/:id', product_controller_1.updateProduct);
router.delete('/:id', product_controller_1.deleteProduct);
exports.default = router;
