import { Router } from 'express';
import { cartsService, productsService } from '../dao/index.js';
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

//pagiante// localhost:8080?page=1 ... 2 ...3 ..etc
router.get('/products', async (req, res) => {
    try {

        const { limit= 4, page=1 } = req.query;
        const query = {};
        const options = {
            limit,
            page,
            sort: { price: 1 },   
            lean: true
        }
        const result = await productsService.getProductsPaginate(query, options);
        //console.log('products', result);
        //obtengo la ruta del servidor 
        const baseUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
        const dataProducts = {
            status:'success',
            payload: result,
            totalPages: result.totalPages,
            prevPage: result.prevPage ,
            nextPage: result.nextPage,
            page: result.page,
            pagingCounter: result.pagingCounter,
            hasPrevPage: result.hasPrevPage,
            hasNextPage: result.hasNextPage,
            prevLink: result.hasPrevPage ? 
            `${baseUrl.replace(`page=${result.page}`, `page=${result.prevPage}`)}` 
            : null,
            nextLink: result.hasNextPage ? baseUrl.includes("page") ? 
            baseUrl.replace(`page=${result.page}`, `page=${result.nextPage}`) :
            baseUrl.concat(`?page=${result.nextPage}`) : null

        }
       // console.log(dataProducts.payload)
       // console.log('Data del console log:', dataProducts.nextLink, dataProducts.prevLink)
        res.render('productsPaginate', dataProducts);
    } catch (error) {
        res.status(500).json({ message: error.message });
        
    }
})

//ruta hardcodeada localhost:8080/cart/6525e395443bd76c765dd0ee
router.get('/cart/:cid', async (req, res) => {
    const cartId = '6525e395443bd76c765dd0ee'
    try {
        const cart = await cartsService.getCartsId(cartId);
        //console.log('Prueba en consola', cart);
        if(!cart){
            return res.status(404).send('No se pudo encontrar el carrito');
        }else{
            //console.log('Carrito en consola ',cart.products);
            res.status(200).render('cart', { products: cart.products });
            
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
})

export { router as viewsRouter }






