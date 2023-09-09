import { Router } from "express";

const router = Router();

let products = [];
//ruta para obtener todos los productos
router.get('/', (req, res) => {
    res.send({data: products});
})
//ruta para obtener todos los productos por ?limit
router.get('/', (req, res) => {
    const limit = req.query.limit//obtengo el limite de tipo string
    const limitNumber = parseInt(limit)
    if(limit){
        const productsLimit = products.slice(0, limitNumber)
        res.send({data: productsLimit})
    }else{
        res.send({data: products})
    }
})
//ruta para obtener un producto
router.get('/:productsId', (req, res) => {
    res.send({data: products[req.params.id]});
})

export { router as productsRoutes};