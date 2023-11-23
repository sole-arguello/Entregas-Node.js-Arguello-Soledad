import express from 'express';
import { __dirname } from './utils.js';//importo dirname para obtener la ruta de mis archivos y path para unir diferentes rutas
import path from 'path';
import { engine } from 'express-handlebars'; //importo libreria handlebars y socket.io
import { Server } from 'socket.io';
import{ connectDB } from './config/dbConnection.js';//importo connectDB

/*---------- aplico jwt ------------------  */
import passport from 'passport';
import cookieParser from 'cookie-parser';
import { initializePassport } from './config/passport.config.js';


import { ProductsService } from './service/products.service.js';
import { ChatService } from './service/chat.service.js';

//importo rutas http y las de handlebars
import { viewsRouter } from './routes/views.routes.js';
import { productsRouter } from './routes/products.routes.js';
import { cartsRouter } from './routes/carts.routes.js';
import { usersSessionsRouter } from './routes/usersSessions.routes.js';


const port = 8080;//configuro puerto
const app = express();

//midleware
app.use(cookieParser());
app.use(express.json());//para recibir json
app.use(express.urlencoded({ extended: true }));//para recibir datos del formulario
app.use(express.static(path.join(__dirname, '/public')));

//configuro para websocket del lado del server
const httpSever = app.listen(port, () => {console.log(`app listening at http://localhost:${port}`);})//http
const socketServer = new Server(httpSever);//web socket
connectDB.getInstance()  //conexion base de datos mongo

//configuracion de handlebars, motor de plantillas
app.engine('.hbs', engine({extname: '.hbs'}));
app.set('view engine', '.hbs');
app.set('views', path.join(__dirname, '/views'));//src/views
//configuracion de passport
initializePassport()//se crean las estrategias
app.use(passport.initialize())//inicializo passport dentro del servidor

//rutas trabajadas con mongo
app.use(viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter)
app.use('/api/sessions', usersSessionsRouter);

//escucho un evento connection, el callback del socket que se acaba de conectar
socketServer.on('connection', async (socket) => {
    console.log('Cliente Conectado');
    try {
        //obtengo todos los productos y los envio al cliente
        const products = await ProductsService.getProducts();
        //envio los productos al cliente
        socket.emit('productsArray', products);
    } catch (error) {
        console.log('Error al obtener los productos', error.message);
        
    }

    //recibo los productos del cliente, los creo y envio al server
    socket.on('newProduct', async (productData) => {
        try {
            //creo los productos 
            await ProductsService.createProduct(productData);
            //obtengo y actualizo los productos
            const products = await ProductsService.getProducts();
            //emito la lista actualizada
            socket.emit('productsArray', products);
            
        } catch (error) {
            console.error('Error al crear un producto:', error.message);
        }
    })

     // Manejar la eliminación de un producto
    socket.on('deleteProduct', async (productId) => {
        
        try {
            // Eliminar el producto de la lista de productos por su ID
            await ProductsService.deleteProduct(productId);
            // Obtener la lista actualizada de productos
            const updatedProducts = await ProductsService.getProducts();
            // Emitir la lista actualizada de productos al cliente
            socket.emit('productsArray', updatedProducts);
        } catch (error) {
            // Manejar errores, por ejemplo, si el producto no se encuentra
            console.error('Error al eliminar un producto:', error.message);
        }
    });

    //-------------- socket del servidor del chat ---------------//
    //traigo todos los chat
    const historyChat = await ChatService.getMessages()
    //emito los caht 
    socket.emit('historyChat', historyChat)
    //recibo mensaje de cada usuario desde el cliente
    socket.on('messageChat', async (messageClient) => {//recibo el mensaje del front
        try {
            //creo los chat en la base de datos
            await ChatService.createMessage(messageClient);
            //obtengo y actualizo los mensajes
            const historyChat = await ChatService.getMessages();
            //replico y envio el mensaje a todos los usuarios
            socketServer.emit('historyChat', historyChat);//envio el mensaje
            
        } catch (error) {
            console.error('Error al enviar el mensaje:', error.message);
        }

    })
})
