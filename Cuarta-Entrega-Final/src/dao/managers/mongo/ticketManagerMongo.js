import { logger } from "../../../helpers/logger.js";
import { ticketModel } from "./models/tickets.model.js";

export class TicketManagerMongo {
  constructor() {
    this.model = ticketModel;
  }

  async createTicket(ticketBody) {
    try {
      const ticket = await this.model.create(ticketBody);
      logger.info("paso por manager createTicket");
      return ticket;
    } catch (error) {
      logger.error("Error en manager createTicket", error.message);
      throw new Error("No se pudo crear el ticket ", error.message);
    }
  }

  async getTickets() {
    try {
      const tickets = await this.model.find().lean();
      logger.info("paso por manager getTikets");
      return tickets;
    } catch (error) {
      logger.error("Error en manager getTickets", error.message);
      throw new Error(
        "No se pudo obtener el listado de los tikets ",
        error.message
      );
    }
  }

  async getTicketById(id) {
    try {
      const tickets = await this.model.findById(id).lean();
      logger.info("paso por getTicketById");
      return tickets;
    } catch (error) {
      logger.error("Error en manager getTiketById", error.message);
      throw new Error("No se pudo obtener el tiket ", error.message);
    }
  }
}
