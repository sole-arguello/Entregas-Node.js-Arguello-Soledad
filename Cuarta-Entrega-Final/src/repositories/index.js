import { CartsRepository } from "./carts.repository.js";
import { ChatRepository } from "./chat.repository.js";
import { ProductsRepository } from "./products.repository.js";
import { TicketsRepository } from "./tickets.repository.js";
import { UsersSessionsRepository } from "./usersSessions.repository.js";


import { cartsDao, chatDao, productsDao, ticketDao, usersSessionsDao } from "../dao/factory.js";

export const cartsService = new CartsRepository(cartsDao)
export const chatService = new ChatRepository(chatDao)
export const productsService = new ProductsRepository(productsDao)
export const ticketService = new TicketsRepository(ticketDao)
export const usersSessionsService = new UsersSessionsRepository(usersSessionsDao)