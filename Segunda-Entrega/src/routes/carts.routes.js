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
  
  //http://localhost:8080/api/carts para craer carritos
  router.post("/", async (req, res) => {
    try {
      const newCart = await cartsService.createCart();
      res.json({ message: "Carrito creado", data: newCart });
    } catch (error) {
      res.json({ status: "error", message: error.message });
    }
  });
  //http://localhost:8080/api/carts/:cid/products/:pid para agregar productos al carrito
  router.post("/:cid/products/:pid", async (req, res) => {
    try {
      const idCarts = req.params.cid;
      const idProduct = req.params.pid;
      const quantity = 1;
  
      const cart = await cartsService.addProduct(idCarts, idProduct, quantity);
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
      const updatedCart = await cartsService.updateCart(id, req.body);// le paso el id y el cuerpo 
      res.json({ message: "Carrito con id ' " + id + " ' actualizado con exito", data: updatedCart });
    }
    catch (error) {
      res.json({ status: "error",  message: error.message });
    }
  })

  router.delete("/:cid", async (req, res) => {
    try {
      const id = req.params.cid;//encuentro el id
      const cartDeleted = await cartsService.deleteCart(id);
      res.json({ message: "Carrito con id ' " + id + " ' eliminado con exito", data: cartDeleted });
      
    }
    catch (error) {
      res.json({ status: "error",  message: error.message });
    }
  })

export { router as cartsRouter}