import passport from "passport";

//------------Roles
export const  authorization = (roles) => {

    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'No autorizado' });
        }
        next();
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