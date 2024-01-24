import passport from "passport";
//------------Roles
export const  authorization = (roles) => {

    return (req, res, next) => {
        console.log("Tipo de Usuario logueado", req.user.role)
        if (!roles.includes(req.user.role)) {
            res.json({status: 'error', message: 'No autorizado para realizar esta accion'})
        }else{
            next();
        }
        
    }
}

//--------------- passport

export const registerLocalStrategy = passport.authenticate(
    'registerLocalStrategy', 
    {
    failureRedirect: '/api/sessions/fail-register',
    session: false
    })



export const registerGithubStrategy = passport.authenticate('registerGithubStrategy')

export const registerGithubStrategyFail = passport.authenticate(
    'registerGithubStrategy', 
    {
        failureRedirect: '/api/sessions/fail-register',
        session: false
    })

export const loginLocalStrategy =  passport.authenticate('loginLocalStrategy',
    {
        failureRedirect: '/api/sessions/fail-login',
        session: false
    })

export const jwtAuth = passport.authenticate('jwtAuth', 
    {
        failureRedirect: '/api/sessions/fail-login', session: false
    })