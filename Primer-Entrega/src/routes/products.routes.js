import { Router } from "express";

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

export { router as productsRoutes};