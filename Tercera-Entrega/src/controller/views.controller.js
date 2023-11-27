import { CartsService } from "../service/carts.service.js";
import { ProductsService } from "../service/products.service.js";

export class ViewsController {
    static renderViewsHome = async (req, res) => {
        try {
            console.log('ususario logueado', req.user);
            //si no esta logeado lo redirige a login
            if(!req.user){
                console.log('error al iniciar sesion');
                res.render('login', 
                { 
                    style: "login.css",
                    error: 'Error al iniciar session, para navegar debe iniciar session'
                })
            }else{
                //si esta logueado lo redirige a home
                const products = await ProductsService.getProducts();
    
                if(products.length === 0){
                    res.render('home', 
                    { 
                        style: "home.css",
                        message: 'No hay productos'
                    });
                    throw new Error('No hay productos');
                }
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
                    res.render('home', 
                    {
                        style: "home.css",
                        products : products,
                        userFirst_name: req.user.first_name,
                        userLast_name: req.user.last_name,
                        userRole: req.user.role
                        
                    });
                }
            }
    
        } catch (error) {
           res.status(500).json({ message: error.message }); 
        }
       
    }
    static renderViewsLogin = async (req, res) => {
        try {
            res.render('login', { style: "login.css"});
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    static renderViewsRegister = async (req, res) => {
        try {
            //console.log(req.body);
            res.render('register', { style: "register.css"});
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    static renderViewsProfile = async (req, res) => { //agrego JWT y saco session
        try {
            if(!req.user){
                res.render('login', 
                { 
                    style: "login.css",
                    error: 'Para navegar debe iniciar session'
                })
            }else{  
                if(req.user.age === 0 && req.user.role === 'admin'){
                    //usuario admin
                    res.render('profile', 
                    {
                        style: "profile.css",
                        userAdmin: true,
                        userFirst_name: req.user.first_name,
                        userEmail: req.user.email,
                        userRole: req.user.role,
                        message: 'Se ha registrado con exito'
                    })
                }else if(req.user.age === 0 && req.user.role === 'Usuario' ) {
                    //usuario github                
                    res.render('profile', 
                    {
                        style: "profile.css",
                        userGithub: true,
                        userFirst_name: req.user.first_name,
                        userUsername: req.user.last_name,
                        userEmail: req.user.email,
                        userRole: req.user.role,
                        message: 'Se ha registrado con exito'
                    });
                }else{
                    //usuario registrado desde la page
                    res.render('profile', 
                    {
                        style: "profile.css",
                        userUser: true,
                        userFirst_name: req.user.first_name,
                        userLast_name: req.user.last_name,
                        userAge: req.user.age,
                        userEmail: req.user.email,
                        userRole: req.user.role,
                        message: 'Se ha registrado con exito'
                    })
                }
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
    static renderViewsRealTime = async (req, res) => {
        try {
            if(!req.user){
                res.render('login', 
                { 
                    style: "login.css",
                    error: 'Para navegar debe iniciar session'
                })
            }else{
                res.render('realTime',{style: "realTime.css",}
                );
            }
            
        } catch (error) {
            res.status(500).json({ message: error.message });        
        }
    }
    static renderViewsMessage = async (req, res) =>{
        try {
            if(!req.user){
                res.render('login', 
                { 
                    style: "login.css",
                    error: 'Para navegar debe iniciar session'
                })
            }else{
                res.render('chat', {style: "chat.css",});
            }
            
        } catch (error) {
            res.status(500).json({ message: error.message });
            
        }
    }
    static renderViewsProducts = async (req, res) => {
        try {
            if(!req.user){
                res.render('login', 
                { 
                    style: "login.css",
                    error: 'Para navegar debe iniciar session'
                })
            }else{
                const { limit= 4, page=1 } = req.query;
                const query = {};
                const options = {
                    limit,
                    page,
                    sort: { price: 1 },   
                    lean: true
                }
                const result = await ProductsService.getProductsPaginate(query, options);
                //console.log('products', result);
                //obtengo la ruta del servidor 
                const baseUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
                const dataProducts = {
                    style: "paginate.css",
                    status:'success',
                    payload: result,
                    totalPages: result.totalPages,
                    prevPage: result.prevPage ,
                    nextPage: result.nextPage,
                    page: result.page,
                    pagingCounter: result.pagingCounter,
                    hasPrevPage: result.hasPrevPage,
                    hasNextPage: result.hasNextPage,
                    prevLink: result.hasPrevPage ? 
                    `${baseUrl.replace(`page=${result.page}`, `page=${result.prevPage}`)}` 
                    : null,
                    nextLink: result.hasNextPage ? baseUrl.includes("page") ? 
                    baseUrl.replace(`page=${result.page}`, `page=${result.nextPage}`) :
                    baseUrl.concat(`?page=${result.nextPage}`) : null
        
                }
               // console.log(dataProducts.payload)
               // console.log('Data del console log:', dataProducts.nextLink, dataProducts.prevLink)
                res.render('productsPaginate', dataProducts);
            }
    
        } catch (error) {
            res.status(500).json({ message: error.message });
            
        }
    }
    static renderViewsCart = async (req, res) => {

        
        const cartId = '6525c4976ff5b06f9bbb8dbc'
        try {
            const cart = await CartsService.getCartsId(cartId);
            //console.log('Prueba en consola', cart);
            if(!cart){
                return res.status(404).send('No se pudo encontrar el carrito');
            }else{
                //console.log('Carrito en consola ',cart.products);
                res.status(200).render('cart', {
                     style: "cart.css",
                     products: cart.products 
                    });
                
            }
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
}