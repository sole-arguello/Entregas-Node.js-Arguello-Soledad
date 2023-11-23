import {Router } from 'express';
import { ProductsController } from '../controller/products.controller.js'; 
import { authorization } from '../middlewares/auth.js';


const router = Router();

router.get('/', ProductsController.getProducts)

router.get('/:id', ProductsController.getProductsId)

//todas estas rutas llevan autorizacion
//localhost:8080/api/products
router.post('/', authorization(['admin']), ProductsController.createProduct)

router.put('/:id', authorization(['admin']), ProductsController.updateProduct)

router.delete('/:id', authorization(['admin']), ProductsController.deleteProduct)

export { router as productsRouter }