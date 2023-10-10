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

  //ruta para actualizar por id
  //http://localhost:8080/api/carts/:cid
  router.put("/:cid", async (req, res) => {
    try {
      const id = req.params.cid;//encuentro el id
      const updatedCart = await cartsService.updateCartId(id, req.body);// le paso el id y el cuerpo 
      res.json({ message: "Carrito con id ' " + id + " ' actualizado con exito", data: updatedCart });
    }
    catch (error) {
      res.json({ status: "error",  message: error.message });
    }
  })
  
  //ruta que actualiza el produto del carrito por su id
  //http://localhost:8080/api/carts/:cid/products/:pid 
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
      const id = req.params.cid;//encuentro el id
      const cartDeleted = await cartsService.deleteCartId(id);
      res.json({ message: "Carrito con id ' " + id + " ' eliminado con exito"});
      
    }
    catch (error) {
      res.json({ status: "error",  message: error.message });
    }
  })

  // Ruta para eliminar un producto específico de un carrito por su ID de carrito y producto
  // http://localhost:8080/api/carts/:cid/products/:pid
  router.delete("/:cid/products/:pid", async (req, res) => {
    try {

        const { cid: idCarts, pid: productId } = req.params;
        const cart = await cartsService.getCartsId(idCarts);
        // Llama al método para eliminar el producto del carrito
        const deletedProduct = await cartsService.deleteProductInCart(idCarts, productId);
        res.json({ message: "Producto eliminado del carrito", data: deletedProduct }); 
    } catch (error) {
        res.status(500).json({ status: "error", message: error.message });
    }
  });


export { router as cartsRouter}