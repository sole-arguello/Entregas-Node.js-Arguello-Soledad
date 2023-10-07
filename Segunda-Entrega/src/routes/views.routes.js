import { Router } from 'express';
import { productsService } from '../dao/index.js';
const router = Router();

//ruta para la vista home de todos los productos
router.get('/', async (req, res) => {
    try {
        const products = await productsService.getProducts();

        if(products.length === 0){
            res.render('no-products', products)
            throw new Error('No hay productos');
        }
        res.render('home', { products : products });//podria ir solo products
    } catch (error) {
       res.status(500).json({ message: error.message }); 
    }
   
})

//ruta para productos en tiempo real Eliminar 
router.get('/realTimeProducts', (req, res) => {
    try {
        res.render('realTime');
    } catch (error) {
        res.status(500).json({ message: error.message });        
    }
})

//message para linkear / caht es la renderizacion hacia el chat 
router.get('/message', (req, res) =>{
    try {
        res.render('chat');
    } catch (error) {
        res.status(500).json({ message: error.message });
        
    }
} )

export { router as viewsRouter }