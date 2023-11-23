import { Router } from 'express';
import { jwtAuth } from '../middlewares/auth.js';
import { ViewsController } from '../controller/views.controller.js';

const router = Router();

//ruta para la vista home de todos los productos
router.get('/', jwtAuth, ViewsController.renderViewsHome)

//ruta para login
router.get('/login', ViewsController.renderViewsLogin)

//ruta para register
router.get('/register', ViewsController.renderViewsRegister)

//ruta para el perfil de usuario
router.get('/profile', jwtAuth, ViewsController.renderViewsProfile)

//ruta para productos en tiempo real Eliminar 
router.get('/realTimeProducts', jwtAuth, ViewsController.renderViewsRealTime)

//message para linkear / caht es la renderizacion hacia el chat 
router.get('/message', jwtAuth, ViewsController.renderViewsMessage)

//pagiante// localhost:8080?page=1 ... 2 ...3 ..etc
router.get('/products', jwtAuth, ViewsController.renderViewsProducts)

//ruta hardcodeada localhost:8080/cart/6525e395443bd76c765dd0ee
router.get('/cart/:cid', ViewsController.renderViewsCart)

export { router as viewsRouter }






