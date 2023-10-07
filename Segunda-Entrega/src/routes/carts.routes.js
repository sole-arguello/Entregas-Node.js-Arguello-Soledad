import { Router } from "express";
import { cartsService } from "../persistence/index.js";

const router = Router();
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
    const idcarts = parseInt(req.params.cid); //obtengo el parametro cid de la URL
    const carts = await cartsService.getCarts();
    const cart = carts.find((cart) => cart.id === idcarts); //busco el carrito por id
    res.json({ message: "Carrito encontrado", data: cart });
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
    const idCarts = parseInt(req.params.cid);
    const idProduct = parseInt(req.params.pid);
    const quantity = 1;

    const cart = await cartsService.addProduct(idCarts, idProduct, quantity);
    res.json({ message: "Producto agregado al carrito", data: cart });
  } catch (error) {
    res.json({ status: "error", message: error.message });
  }
});

export { router as cartsRouter };
