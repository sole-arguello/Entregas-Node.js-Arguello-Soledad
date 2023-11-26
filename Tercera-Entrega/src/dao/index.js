
import { __dirname } from "../utils.js";


import { ProductsManagerMongo } from './managers/mongo/productsManagerMongo.js';
import { CartsManagerMongo } from './managers/mongo/cartsManagerMongo.js'
import { ChatManagerMongo } from "./managers/mongo/chatManagerMongo.js";
import { UsersManagerMongo } from "./managers/mongo/usersManagerMongo.js";
import { TiketManagerMongo } from "./managers/mongo/tiketManagerMongo.js";

export const productsDao = new ProductsManagerMongo();
export const cartsDao = new CartsManagerMongo();
export const chatDao = new ChatManagerMongo();
export const usersDao = new UsersManagerMongo();
export const tiketDao = new TiketManagerMongo()

