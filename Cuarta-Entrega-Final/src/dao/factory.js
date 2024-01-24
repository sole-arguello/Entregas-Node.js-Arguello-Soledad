import { config } from "../config/config.js";
import { __dirname } from "../utils.js";
import path from "path";
import { logger } from "../helpers/logger.js";

let productsDao;
let cartsDao;
let chatDao;
let usersSessionsDao;
let ticketDao;

const enviroment = config.enviroment.persistence;

switch (enviroment) {
  case "production": {
    //Mongo DB
    const { connectDB } = await import("../config/dbConnection.js");
    connectDB.getInstance();

    //Products
    const { ProductsManagerMongo } = await import(
      "../dao/managers/mongo/productsManagerMongo.js"
    );
    productsDao = new ProductsManagerMongo();

    //Carts
    const { CartsManagerMongo } = await import(
      "../dao/managers/mongo/cartsManagerMongo.js"
    );
    cartsDao = new CartsManagerMongo();

    //Chat
    const { ChatManagerMongo } = await import(
      "../dao/managers/mongo/chatManagerMongo.js"
    );
    chatDao = new ChatManagerMongo();

    //Users
    const { UsersManagerMongo } = await import(
      "../dao/managers/mongo/usersManagerMongo.js"
    );
    usersSessionsDao = new UsersManagerMongo();

    //tikets
    const { TicketManagerMongo } = await import(
      "./managers/mongo/ticketManagerMongo.js"
    );
    ticketDao = new TicketManagerMongo();

    logger.info("Estoy en el entorno de produccion");
    break;
  }
  //////////////////////////////////////////////////////////////////////////////////////////

  case "development": {
    ///files system

    //Products
    const { ProductManagerFs } = await import(
      "./managers/fileSystemManagers/productManagerFs.js"
    );
    productsDao = new ProductManagerFs(
      path.join(
        __dirname,
        "/dao/managers/fileSystemManagers/files/products.json"
      )
    );

    //Carts
    const { CartsManagerFs } = await import(
      "./managers/fileSystemManagers/cartsManagerFs.js"
    );
    cartsDao = new CartsManagerFs(
      path.join(__dirname, "/dao/managers/fileSystemManagers/files/carts.json")
    );

    logger.info("Estoy en el entorno de desarrollo");
    break;
  }

  case "test": {
    const { connectDB } = await import("../config/dbConnection.js");
    connectDB.getInstance();

    //Products
    const { ProductsManagerMongo } = await import(
      "../dao/managers/mongo/productsManagerMongo.js"
    );
    productsDao = new ProductsManagerMongo();

    //Carts
    const { CartsManagerMongo } = await import(
      "../dao/managers/mongo/cartsManagerMongo.js"
    );
    cartsDao = new CartsManagerMongo();

    //Chat
    const { ChatManagerMongo } = await import(
      "../dao/managers/mongo/chatManagerMongo.js"
    );
    chatDao = new ChatManagerMongo();

    //Users
    const { UsersManagerMongo } = await import(
      "../dao/managers/mongo/usersManagerMongo.js"
    );
    usersSessionsDao = new UsersManagerMongo();

    //tikets
    const { TicketManagerMongo } = await import(
      "./managers/mongo/ticketManagerMongo.js"
    );
    ticketDao = new TicketManagerMongo();

    logger.info("Estoy en el entorno de pruebas");
    break;
  }
}

export { productsDao, cartsDao, chatDao, usersSessionsDao, ticketDao };
