import passport from "passport";
export const isAuth = (req, res, next) => {
    
}

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