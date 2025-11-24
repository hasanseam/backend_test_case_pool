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
const express_1 = __importDefault(require("express"));
const product_routes_1 = __importDefault(require("./routes/product.routes"));
const AppError_1 = require("./middleware/AppError");
const db_1 = __importDefault(require("./config/db"));
const dotenv_1 = __importDefault(require("dotenv"));
//basic boilerplate if there is env. as it is small prject i dont have any env
dotenv_1.default.config();
const app = (0, express_1.default)();
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, db_1.default)();
    app.use(express_1.default.json());
    //all rout declaration
    app.use('/api/products', product_routes_1.default);
    // Handle 404 for routes that are not found
    app.all('*', (req, res, next) => {
        next(new AppError_1.AppError(`Can't find ${req.originalUrl} on this server!`, 404));
    });
    // Global error handler
    app.use((err, req, res, next) => {
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
});
startServer();
