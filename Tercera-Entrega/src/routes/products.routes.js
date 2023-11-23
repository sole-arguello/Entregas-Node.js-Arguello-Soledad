import {Router } from 'express';
import { ProductsController } from '../controller/products.controller.js'; 


const router = Router();

router.get('/', ProductsController.getProducts)

router.get('/:id', ProductsController.getProductsId)

//localhost:8080/api/products
router.post('/', ProductsController.createProduct)

router.put('/:id', ProductsController.updateProduct)

router.delete('/:id', ProductsController.deleteProduct)

export { router as productsRouter }