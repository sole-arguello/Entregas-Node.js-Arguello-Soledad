import {Router} from 'express';
import { authorization, jwtAuth } from '../middlewares/auth.js';
import { UsersController } from '../controller/users.controller.js';
import { uploadDocuments } from '../utils.js';

const router = Router();
//El admin debe estar logueado y colocar un id de usuario en la ruta 
//localhost:8080/api/users/premium/:uid
router.put('/premium/:uid',jwtAuth, authorization(['admin']), UsersController.modifyRole)

router.post('/:uid/documents',jwtAuth, authorization(['user']), uploadDocuments.fields([
    {name: 'identificacion', maxCount: 1},
    {name: 'domicilio', maxCount: 1},
    {name: 'estadoDeCuenta', maxCount: 1},
]), UsersController.uploaderUserDocuments)

export {router as usersRouter}