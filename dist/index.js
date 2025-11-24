"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const product_routes_1 = __importDefault(require("./product.routes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use('/api', product_routes_1.default);
app.use((err, req, res, next) => {
    res.status(err.status || 500).json({
        message: err.message,
        status: err.status || 500,
    });
});
const PORT = process.env.PORT || 3000;
mongoose_1.default.connect('mongodb://localhost:27017/product-api')
    .then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})
    .catch(err => {
    console.error('Database connection error:', err);
});
