import express from "express";
import morgan from "morgan";
import { __dirname } from "./utils.js"; //importo dirname para obtener la ruta de mis archivos y path para unir diferentes rutas
import path from "path";
/*--------- motor de plantillas frontend------------------  */
import { engine } from "express-handlebars"; //importo libreria handlebars y socket.io
/*--------- servidores y websockets ------------------  */
import { Server } from "socket.io";
import { errorHandler } from "./middlewares/errors/errorHandler.js";
/*--------- aplico logger manejo de errores ------------------  */
import { logger } from "./helpers/logger.js";
/*---------- aplico jwt ------------------  */
import passport from "passport";
import cookieParser from "cookie-parser";
import { initializePassport } from "./config/passport.config.js";
import { config } from "./config/config.js";
/*---------- aplico documentacion ------------------  */
import { swaggerSpecs } from "./config/swagger.config.js";
import swaggerUi from "swagger-ui-express";
/*---------- servicios ------------------  */
import { productsService, chatService } from "./repositories/index.js";
//importo rutas http y las de handlebars
import { viewsRouter } from "./routes/views.routes.js";
import { productsRouter } from "./routes/products.routes.js";
import { cartsRouter } from "./routes/carts.routes.js";
import { usersSessionsRouter } from "./routes/usersSessions.routes.js";
import { usersRouter } from "./routes/users.routes.js";

const port = config.server.port; //configuro puerto
const app = express();

//midleware
app.use(cookieParser());
app.use(express.json()); //para recibir json
app.use(express.urlencoded({ extended: true })); //para recibir datos del formulario
app.use(express.static(path.join(__dirname, "/public")));

//configuro para websocket del lado del server
const httpSever = app.listen(port, () => {
  logger.info(`app listening at http://localhost:${port}`);
}); //http
const socketServer = new Server(httpSever); //web socket

//configuracion de handlebars, motor de plantillas
app.engine(".hbs", engine({ extname: ".hbs" }));
app.set("view engine", ".hbs");
app.set("views", path.join(__dirname, "/views")); //src/views
//configuracion de passport
initializePassport(); //se crean las estrategias
app.use(passport.initialize()); //inicializo passport dentro del servidor

//rutas trabajadas con mongo
app.use(viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use("/api/sessions", usersSessionsRouter);
app.use("/api/users", usersRouter)
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs))

//escucho un evento connection, el callback del socket que se acaba de conectar
socketServer.on("connection", async (socket) => {
  logger.info("Cliente Conectado");
  try {
    //obtengo todos los productos y los envio al cliente
    const products = await productsService.getProducts();
    //envio los productos al cliente
    socket.emit("productsArray", products);
  } catch (error) {
    logger.error("Error al obtener los productos", error.message);
  }

  //recibo los productos del cliente, los creo y envio al server
  socket.on("newProduct", async (productData) => {
    try {
      //creo los productos
      await productsService.createProduct(productData);
      //obtengo y actualizo los productos
      const products = await productsService.getProducts();
      //emito la lista actualizada
      socket.emit("productsArray", products);
    } catch (error) {
      logger.error("Error al crear un producto:", error.message);
    }
  });

  // Manejar la eliminación de un producto
  socket.on("deleteProduct", async (productId) => {
    try {
      // Eliminar el producto de la lista de productos por su ID
      await productsService.deleteProduct(productId);
      // Obtener la lista actualizada de productos
      const updatedProducts = await productsService.getProducts();
      // Emitir la lista actualizada de productos al cliente
      socket.emit("productsArray", updatedProducts);
    } catch (error) {
      // Manejar errores, por ejemplo, si el producto no se encuentra
      logger.error("Error al eliminar un producto:", error.message);
    }
  });

  //-------------- socket del servidor del chat ---------------//
  //traigo todos los chat
  const historyChat = await chatService.getMessages();
  //emito los caht
  socket.emit("historyChat", historyChat);
  //recibo mensaje de cada usuario desde el cliente
  socket.on("messageChat", async (messageClient) => {
    //recibo el mensaje del front
    try {
      //creo los chat en la base de datos
      await chatService.createMessage(messageClient);
      //obtengo y actualizo los mensajes
      const historyChat = await chatService.getMessages();
      //replico y envio el mensaje a todos los usuarios
      socketServer.emit("historyChat", historyChat); //envio el mensaje
    } catch (error) {
      console.log("Error al enviar el mensaje:", error.message);
    }
  });
});

app.use(errorHandler);
app.use(morgan("dev"));

export { app }