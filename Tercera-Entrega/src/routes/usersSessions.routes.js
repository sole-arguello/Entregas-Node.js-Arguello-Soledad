import { Router } from "express";
import { config } from "../config/config.js";
import { registerLocalStrategy, registerGithubStrategy, registerGithubStrategyFail, loginLocalStrategy } from "../middlewares/auth.js";
import { UsersSessionsController } from "../controller/usersSessions.controller.js";

const router = Router();
/*--------------- esctrategia registro local ---------------*/
//registro al ususario
router.post('/register', registerLocalStrategy, UsersSessionsController.renderRegister )

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

//para eliminar la seccion
router.get('/logout', UsersSessionsController.renderLogout)



export { router as usersSessionsRouter}