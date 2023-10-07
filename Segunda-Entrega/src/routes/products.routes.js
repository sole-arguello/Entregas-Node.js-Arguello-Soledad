import { Router } from "express";
import { productsService } from "../persistence/index.js";

const router = Router();

//http://localhost:8080/api/products //http://localhost:8080/api/products?limit=rangoLimite
router.get('/', async (req, res) => {//ruta para obtener todos los productos

    try {
        const limit = req.query.limit//obtengo el limite de tipo string
        const limitNumber = parseInt(limit)
        const products = await productsService.getProducts()
        if(limit){
            const productsLimit = products.slice(0, limitNumber)
            res.json({ message: 'Listado de productos por limit:', data: productsLimit})
        }else{
            res.json({ message: 'Listado de productos', data: products })
        }
    } catch (error) {
        res.json({status: 'error', message: error.message})
    }
})

//http://localhost:8080/api/products/numeroABuscar
router.get('/:pid', async (req, res) => {//para obtener un producto por id
    try {
        const productId = parseInt(req.params.pid)
        const product = await productsService.getProductById(productId)
        res.json({ message: 'El producto obtenido: ', data: product })
    } catch (error) {
        res.json({status: 'error', message: error.message})
    }

})

//http://localhost:8080/api/products
router.post('/', async (req, res) => {
    try {
        const product = req.body;
        if (!product) {
            throw new Error('El cuerpo de la solicitud está vacío');
        }
        const newProduct = await productsService.createProduct(product);
        res.json({ message: 'El producto creado: ', data: newProduct });
    } catch (error) {
        res.json({status: 'error', message: error.message})
    }
        
})

//http://localhost:8080/api/products/numeroActualizar
router.put('/:pid', async (req, res) => {
    try {
        //traigo el id a modificar
        const productId = parseInt(req.params.pid)
        //traigo los campos cargados
        const product = req.body
        //actualizo
        const updatedProduct = await productsService.updateProduct(productId, product)
        res.json({ message: 'El producto actualizado: ', data: updatedProduct })
    } catch (error) {
        res.json({status: 'error', message: error.message})
    }
})

//http://localhost:8080/api/products/numeroEliminar
router.delete('/:pid', async (req, res) => {
    try {
        const productId = parseInt(req.params.pid)
        const deletedProduct = await productsService.deleteProduct(productId)
        console.log({deletedProduct});
        res.json({ message: 'El producto eliminado: ', data: deletedProduct })
    } catch (error) {
        res.json({status: 'error', message: error.message})
    } 
})

export { router as productsRoutes};