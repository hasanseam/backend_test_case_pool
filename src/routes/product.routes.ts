
import { Router } from 'express';
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from '../controller/product.controller';

const router = Router();

//all product routes
router.post('/', createProduct);
router.get('/', getProducts);
router.get('/:id', getProductById);
router.patch('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;
