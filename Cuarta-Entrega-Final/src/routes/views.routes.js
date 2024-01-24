import { Router } from "express";
import { authorization, jwtAuth } from "../middlewares/auth.js";
import { ViewsController } from "../controller/views.controller.js";
import { logger } from "../helpers/logger.js";

const router = Router();

//ruta para la vista home de todos los productos
router.get("/",jwtAuth,authorization(["user", "admin", 'premium']),ViewsController.renderViewsHome);

//ruta para login
router.get("/login",authorization(["user", "admin", "premium"]),ViewsController.renderViewsLogin)

//ruta para register
router.get("/register", ViewsController.renderViewsRegister);

//ruta para el perfil de usuario
router.get("/profile", jwtAuth, authorization(["user", "admin", "premium"]),ViewsController.renderViewsProfile);

//ruta para productos en tiempo real crear y Eliminar
router.get("/realTimeProducts",jwtAuth,authorization(["admin", "premium"]),ViewsController.renderViewsRealTime);

//message para linkear / caht es la renderizacion hacia el chat
router.get("/message",jwtAuth,authorization(["user, admin", "premium"]),ViewsController.renderViewsMessage);

//pagiante// localhost:8080?page=1 ... 2 ...3 ..etc
router.get("/products",jwtAuth,authorization(["user", "admin", "premium"]),ViewsController.renderViewsProducts);

//ruta hardcodeada localhost:8080/cart/6525e395443bd76c765dd0ee
router.get("/cart/:cid",authorization(["user", "admin", "premium"]),ViewsController.renderViewsCart);

//restablecer password
router.get('/forgot-password', (req, res) => {
  res.render('forgotPassView')
})

router.get('/reset-password', (req, res) => {
  const token = req.query.token
  console.log('token', token)
  res.render('resetPassView', { token } )
})

//http://localhost:8080/mokingProducts
router.get("/mokingProducts", ViewsController.mockingProducts);

//RUTA PARA PROBAR LOGGERS SEGUN ENTORNO DE TRABAJO
//http://localhost:8080/loggerTest
router.get("/loggerTest", (req, res) => {
    logger.debug("Soy un mensaje DEBUG");
    logger.verbose("Soy un mensaje VERBOSE");
    logger.http("Soy un mensaje HTTP");
    logger.info("Soy un mensaje INFO");
    logger.warn("Soy un mensaje WARN");
    logger.error("Error fatal")

    res.json({ status: "success", message: "Petición recibida" });
  });

// viewsRouter.get("/cart", async (req, res) => {
//     const cartId = await cartsModel.findOne().sort({ carts: -1 });
//     const cart = await CartsService.getCartById(cartId,{lean:true});
//     const productsCart = cart.products;
//     res.render("cart", { products: productsCart})
// });



export { router as viewsRouter };
