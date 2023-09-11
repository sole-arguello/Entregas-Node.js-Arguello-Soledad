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

export { router as cartsRouter };