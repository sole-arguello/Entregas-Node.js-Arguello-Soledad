import { generateToken, isValidPassword } from "../utils.js";
import { logger } from "../helpers/logger.js";
import { generateEmailToken, sendChangePasswordEmail, verifyEmailToken } from "../helpers/email.js";
import { usersSessionsService, productsService } from "../repositories/index.js";
import { createHash } from "../utils.js";


export class UsersSessionsController {
    static renderRegister = async (req, res) => {
        logger.info('Renderizo a login luego de registrar usuario')
        return res.render('login', {
            style: "login.css",
            message: `Hola, ${req.user.first_name} te has registrado con exito`
        });
    
    }
    static renderRegisterFail = async (req, res) => {
        res.render('register', {
            style: "register.css",
            error: 'Error al registrar el usuario'
        });
        logger.error('Error al registrar el usuario');
    }
    static renderRegisterGithub = async (req, res) => {
        const user = req.user;
        const token = generateToken(user);
        logger.info('Registro github correcto');
        res.cookie('authLogin', token, {maxAge: 43200000, httpOnly: true});
        return res.render('/profile',  {style: "profile.css"});
        
    }
    static renderLogin = async (req, res) => {
        try {
            //manejo de errores en middlewares
            const user = req.user;
            const token = generateToken(user);
            logger.info('Login correcto - ', {message: user.role});
            res.cookie('cookieLogin', token, {maxAge: 43200000, httpOnly: true});
            //res.redirect('/')
            //res.render('home', {style: "home.css"});//redirecciono a home y ya tiene acceso a navegar en la page
            const products = await productsService.getProducts();
            if(req.user.role === 'admin'){
                res.render('home', 
                { 
                    style: "home.css",
                    userAdmin: true,
                    products : products,
                    userFirst_name: req.user.first_name,
                    userLast_name: req.user.last_name,
                    userRole: req.user.role
                    
                });
                
            }else{
                logger.info('ususario logueado');
                res.render('home', 
                {
                    style: "home.css",
                    products : products,
                    userFirst_name: req.user.first_name,
                    userLast_name: req.user.last_name,
                    userRole: req.user.role
                    
                });
            }           
        } catch (error) {
            logger.error(error.message);
            return res.render('login', {
                style: "login.css",
                error: 'Credenciales incorrectas'
            });
            
        }
    }
    static renderLoginFail = async (req, res) => {
        logger.error('error al iniciar sesion');
        return res.render('login', {
         style: "login.css",
         error: 'Para navegar debe iniciar sesion'
         }); 
         
     }
     static renderLogout = async (req, res) => {
        try {
            console.log(req.user)
            const user = {...req.user}
            user.last_connection = new Date();
            await usersSessionsService.updateUser(user._id, user);
            logger.info('sesion cerrada');
            res.clearCookie('cookieLogin');
            //una vez cerrada la sesion lo redirige a login 
            return res.render('loguin', {style: "loguin.css"});
           
        } catch (error) {
           // logger.error(error.message);
            res.status(500).json({ message: error.message });
        }
    }

    static forgotPassword = async (req, res) => {
        const {email} = req.body;//email del usuario
        console.log(email)
        try {
 
            //verifico si existe traigo el email del repository
            const user = await usersSessionsService.getUserByEmail(email);
            //console.log(user)
            const emailToken = generateEmailToken(email, 5 * 60)//5min
            await sendChangePasswordEmail(req, email, emailToken);
            logger.info('Envio email para restablecer contraseña');
            return res.send(`Revisa tu correo para restablecer tu contraseña 
            <a href="/">Volver al login</a>`);
        } catch (error) {
            logger.error(error.message);
            res.status(500).json({status: 'error', message: error.message });
        }
        
    } 

    static resetPassword = async (req, res) => {
        try {
           const token = req.query.token;
           const { newPassword } = req.body;
           //validar el token sea valido
           const validEmail = verifyEmailToken(token);
           console.log('validEmail', validEmail)
           if(!validEmail){
            logger.info('El enlace ya no es valido');
            return res.send(`El enlace ya no es valido, genera un nuevo enlace 
              <a href="/forgot-password"> Enlace</a>`)
           }
           //verifico que el usuario exista
           const user = await usersSessionsService.getUserByEmail(validEmail);
           if(!user){
            logger.info('Esta operacion no se puede realizar');
            return res.send('Esta operacion no se puede realizar')
           }
           console.log('user', user)
           console.log(' newPassword',newPassword)
           //comparo las contrase;as
           if(isValidPassword(newPassword, user)){
             logger.info('credenciales invalidas');
             return res.render('resetPassView', {error: 'credendiales invalidas', token})
           }
           const userData = {
                //obtengo el usuario que esta en DB y cambio la propiedad password
               ...user,
               password: createHash(newPassword)
            }
            console.log('userData', userData)
           //actualizo
           await usersSessionsService.updateUser(user._id, userData);
           logger.info('Contraseña actualizada con exito, renderizo al login');
           return res.render('login', {message: 'Contraseña actualizada con exito', style: "login.css"})


           } catch (error) {
            logger.error(error.message);
            res.status(500).json({ message: error.message });
        }
    }
}