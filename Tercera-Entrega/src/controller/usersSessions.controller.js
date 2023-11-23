import { generateToken } from "../utils.js";

export class UsersSessionsController {
    static renderRegister = async (req, res) => {
        res.render('login', {
            style: "login.css",
            message: `Hola, ${req.user.first_name} te has registrado con exito`
        });
    
    }
    static renderRegisterFail = async (req, res) => {
        res.render('register', {
            style: "register.css",
            error: 'Error al registrar el usuario'
        });
    }
    static renderRegisterGithub = async (req, res) => {
        const user = req.user;
        const token = generateToken(user);
        res.cookie('authLogin', token, {maxAge: 43200000, httpOnly: true});
        res.redirect('/profile')
    }
    static renderLogin = async (req, res) => {
        try {
            const user = req.user;
            const token = generateToken(user);
            res.cookie('cookieLogin', token, {maxAge: 43200000, httpOnly: true});
            res.redirect('/');//redirecciono a home y ya tiene acceso a navegar en la page
            console.log('Usuario Logueado', req.user.role);
        } catch (error) {
            res.render('login', {
                style: "login.css",
                error: 'Credenciales incorrectas'
            });
        }
    }
    static renderLoginFail = async (req, res) => {
        res.render('login', {
         style: "login.css",
         error: 'Para navegar debe iniciar sesion'
         }); 
     }
     static renderLogout = async (req, res) => {
        try {
            res.clearCookie('cookieLogin');
            //una vez cerrada la sesion lo redirige a login
            res.redirect('/login');
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}