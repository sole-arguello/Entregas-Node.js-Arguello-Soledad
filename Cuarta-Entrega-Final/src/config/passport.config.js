import passport from "passport";
import LocalStrategy from "passport-local";
import GithubStrategy from "passport-github2";
import jwt from "passport-jwt";
import { config } from "./config.js";
import { createHash, isValidPassword, cookieExtractor } from "../utils.js";
import { usersSessionsService } from "../repositories/index.js";

//variables para jwt
const JwtStrategy = jwt.Strategy;
const extractJwt = jwt.ExtractJwt;


export const initializePassport = () => {

    //estrategia para registro local
    passport.use('registerLocalStrategy', new LocalStrategy(
        {
            //me permite acceder con los datos del usuario
            passReqToCallback: true,
            usernameField: 'email',//username ahora es igual email
        },
        async(req, username, password, done) =>{

            const {first_name, last_name, age} = req.body
            //console.log('req.file', req.file)
            try {
                //console.log("paso por Passport registerLocalStrategy");
                //busco el usuario por email
                const user = await usersSessionsService.getUserByEmail(username)
                //console.log('Usuario local', user)
                
                if(user){//null: que no hubo error, false: ya existe, un mensaje
                    //el usuario ya existe
                    return done(null, false)
                }

                //el usuario no existe, creo el usuario, y al password la hasheo antes de guardarlo
                const newUser = {
                    first_name,
                    last_name,
                    age,
                    email: username,
                    password: createHash(password),
                    role: 'user',
                    avatar: req.file.filename
                }
                console.log(newUser)
                //creo un nuevo usuario
                const userCreated = await usersSessionsService.createUsers(newUser)
               
                return done(null, userCreated)
            } catch (error) {
                return done(error, {message: 'Error al crear el usuario'})
            }
        }
    
    ))

    //estrategia para login local
    passport.use('loginLocalStrategy', new LocalStrategy(
        {
            usernameField: 'email',//username ahora es igual email
        },
        async (username, password, done) => {
            try {
                //console.log("paso por Passport loginLocalStrategy");
                //busco el usuario por email
                const user = await usersSessionsService.getUserByEmail(username);
                //al revez del registro
                if (!user) {
                //el usuario no esta registrado
                    return done(null, false)//usuario no esta registrado
                }
                if (!isValidPassword(password, user)) {
                    return done(null, false);//{ message: 'Credenciales invalidas' }
                }
                //si todo esta ok(null), creo la session del usuario(user)
                user.last_connection = new Date();
                await usersSessionsService.updateUser(user._id, user);
                return done(null, user);//pase por la serealizacion
            } catch (error) {
                return done(error);
            }
        }
    ));

    //estrategia para registro con github
    passport.use('registerGithubStrategy', new GithubStrategy(
        {
            clientID: config.github.clientId ,
            clientSecret: config.github.clientSecret,
            callbackURL: `http://localhost:8080/api/sessions${config.github.callbackUrl}`  
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                //console.log("paso por Passport registerGithubStrategy");
                //console.log('Perfil', profile)
                const user = await usersSessionsService.getUserByEmail(profile.username)
                if(user){
                    return done(null, user)
                }
                const newUser = {
                    first_name: profile._json.name,
                    last_name: profile.username,
                    age: 0,
                    email: profile._json.email,
                    password: createHash(profile.id),
                    role: 'user'
                }
                
               // console.log(newUser)
                const userCreated = await usersSessionsService.createUsers(newUser)
                return done(null, userCreated)
            } catch (error) {
                return done(error)
            }
        }
    ))


    //Estrategia JWT
    passport.use('jwtAuth', new JwtStrategy(
        {
            //Extraigo la info del token
            jwtFromRequest: extractJwt.fromExtractors([cookieExtractor]),
            secretOrKey: config.tokenJWT.tokenJWT_Key
        },
        async (jwtPayload, done) =>{
            try{
                //console.log("paso por Passport jwtAuth");
                return done(null, jwtPayload)
            } catch(error){
                return done(error)
            }
        }
    ))

}