import { Router } from "express";
import { config } from "../config/config.js";
import { 
    registerLocalStrategy, registerGithubStrategy, 
    registerGithubStrategyFail, loginLocalStrategy, jwtAuth } from "../middlewares/auth.js";
import { UsersSessionsController } from "../controller/usersSessions.controller.js";
import { uploadProfile } from "../utils.js";

const router = Router();
/*--------------- esctrategia registro local ---------------*/
//registro al ususario
router.post('/register', uploadProfile.single('avatar'), registerLocalStrategy, UsersSessionsController.renderRegister )

router.get('/fail-register', UsersSessionsController.renderRegisterFail)
/*----------------estrategia registro con github----------------*/
//ruta registro con github
router.get('/register-github', registerGithubStrategy)
//ruta collback con github
router.get(config.github.callbackUrl, registerGithubStrategyFail, UsersSessionsController.renderRegisterGithub)
/*---------------- estrategia login ------------*/

//logueo al usuario se admin o usuario locales//localhost:8080/api/sessions/login
router.post('/login', loginLocalStrategy, UsersSessionsController.renderLogin)
router.get('/fail-login', UsersSessionsController.renderLoginFail)

/*--------------------------------------------------- */

router.post('/forgot-password', UsersSessionsController.forgotPassword)
router.post('/reset-password', UsersSessionsController.resetPassword)

//para eliminar la seccion
router.get('/logout', jwtAuth, UsersSessionsController.renderLogout)


export { router as usersSessionsRouter}