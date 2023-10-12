import { Router } from 'express';
import { cartsService } from '../dao/index.js';


const router = Router()

//http://localhost:8080/api/carts
router.get("/", async (req, res) => {
    try {
      const carts = await cartsService.getCarts();
      res.json({ message: "Listado de carritos", data: carts });
    } catch (error) {
      res.json({ status: "error", message: error.message });
    }
  });
  
  //http://localhost:8080/api/carts/cid para obtener el carrito por ID
  router.get("/:cid", async (req, res) => {
    try {
      const idcarts = req.params.cid; //obtengo el parametro cid de la URL
      //tarigo el caarito por medio de la populacion
      const carts = await cartsService.getCartsId(idcarts);
      if(carts){
        res.json({ message: "Carrito encontrado", data: carts });
      }else{
        res.json({ status: "error", message: "Carrito no encontrado"});
      }
      
    } catch (error) {
      res.json({ status: "error", message: error.message });
    }
  });
  
  //http://localhost:8080/api/carts para craer carritos vacios
  router.post("/", async (req, res) => {
    try {
      const newCart = await cartsService.createCart();
      res.json({ message: "Carrito creado", data: newCart });
    } catch (error) {
      res.json({ status: "error", message: error.message });
    }
  });

    //http://localhost:8080/api/carts/:cid//ruta para actualizar por id el carrito completo
  router.put("/:cid", async (req, res) => {
    try {
      const {cid: idCart } = req.params; //obtengo el id del carrito
      const newProduct = req.body;//obtengo el producto
      const updatedCart = await cartsService.updateCartId(idCart, newProduct);// le paso el id y el cuerpo 
      res.json({ message: "Carrito actualizado con exito", data: updatedCart });
    }
    catch (error) {
      res.json({ status: "error",  message: error.message });
    }
  })
  
  //http://localhost:8080/api/carts/:cid/product/:pid para agregar productos al carrito
  router.put("/:cid/product/:pid", async (req, res) => {
    try {
      const {cid: idCarts, pid: idProduct} = req.params;
  
      const cart = await cartsService.addProduct(idCarts, idProduct);
      res.json({ message: "Producto agregado al carrito", data: cart });
    } catch (error) {
      res.json({ status: "error", message: error.message });
    }
  });

  
  //http://localhost:8080/api/carts/:cid/products/:pid //ruta que actualiza el produto del carrito por su id
  router.put("/:cid/products/:pid", async (req, res) => {
    try {
      const { cid: id, pid: idProduct } = req.params;
      const newQuantity  = req.body.newQuantity;
      const updatedCart = await cartsService.updateProductInCart(id, idProduct, newQuantity);
      res.json({ message: "success", data: updatedCart });
    }
    catch (error) {
      res.json({ status: "error",  message: error.message });
    }
  })
  
   //http://localhost:8080/api/carts/:cid
  router.delete("/:cid", async (req, res) => {
    try {
      const { cid: cartId } = req.params;//encuentro el id
      const cartDeleted = await cartsService.deleteCartId(cartId);
      res.json({ message: "Carrito con id ' " + cartId + " ' eliminado con exito", data: cartDeleted });
      
    }
    catch (error) {
      res.json({ status: "error",  message: error.message });
    }
  })


  // http://localhost:8080/api/carts/:cid/products/:pid   // Ruta para eliminar un producto específico de un carrito por su ID de carrito y producto
  router.delete("/:cid/products/:pid", async (req, res) => {
    try {

        const { cid: idCarts, pid: productId } = req.params;
        const deletedProduct = await cartsService.deleteProductInCart(idCarts, productId);
        res.json({ message: "Producto eliminado del carrito", data: deletedProduct }); 
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
  });


export { router as cartsRouter}