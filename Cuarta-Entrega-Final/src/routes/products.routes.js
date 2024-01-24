import {Router } from 'express';
import { ProductsController } from '../controller/products.controller.js'; 
import { authorization, jwtAuth } from '../middlewares/auth.js';



const router = Router();

router.get('/', ProductsController.getProducts)

router.get('/:id', ProductsController.getProductById)

//todas estas rutas llevan autorizacion
//localhost:8080/api/products
router.post('/', jwtAuth, authorization(['admin', 'premium']), ProductsController.createProduct)

router.put('/:id', jwtAuth,  authorization(['admin']), ProductsController.updateProduct)

router.delete('/:id', jwtAuth, authorization(['admin', 'premium']), ProductsController.deleteProduct)

export { router as productsRouter }