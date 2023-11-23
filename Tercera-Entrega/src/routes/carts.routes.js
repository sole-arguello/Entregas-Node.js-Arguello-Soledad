import { Router } from 'express';
import { CartsController } from '../controller/carts.controller.js';


const router = Router()

//http://localhost:8080/api/carts
router.get("/", CartsController.getCarts)
  
  http://localhost:8080/api/carts/cid para obtener el carrito por ID
  router.get("/:cid", CartsController.getCartsId)
  
  http://localhost:8080/api/carts para craer carritos vacios
  router.post("/", CartsController.createCart)

    http://localhost:8080/api/carts/:cid//ruta para actualizar por id el carrito completo
  router.put("/:cid", CartsController.updateCartId)
  
  //http://localhost:8080/api/carts/:cid/product/:pid para agregar productos al carrito
  router.put("/:cid/product/:pid", CartsController.addProduct)

  
  //http://localhost:8080/api/carts/:cid/products/:pid //ruta que actualiza el produto del carrito por su id
  router.put("/:cid/products/:pid", CartsController.updateProductInCart)
  
//http://localhost:8080/api/carts/:cid
  router.delete("/:cid", CartsController.deleteCartId)

//http://localhost:8080/api/carts/:cid/products/:pid   // Ruta para eliminar un producto específico de un carrito por su ID de carrito y producto
  router.delete("/:cid/products/:pid", CartsController.deleteProductInCart)


export { router as cartsRouter}