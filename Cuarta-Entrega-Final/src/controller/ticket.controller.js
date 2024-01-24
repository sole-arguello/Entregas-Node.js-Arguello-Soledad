import { ticketService } from '../repositories/index.js'
import { logger } from '../helpers/logger.js';

export class TicketController {
    
    static createTicket = async (req, res) => {

        try {
            const ticketBody = req.body;
            const newTicket = await ticketService.createTicket(ticketBody);
            logger.info('Ticket creado', newTicket);
            res.json({ message: "Ticket creado", data: newTicket });
            
        } catch (error) {
            logger.error('error createTicket controller', error.message);
            res.json({ status: "error", message: error.message });
        }
    }
    static getTicket = async (req, res) => {
        try {
            const tickets = await ticketService.getTicket();
            logger.info('Listado de tickets', tickets);
            res.json({ message: "Listado de tickets", data: tickets });
            
        } catch (error) {
            logger.error('error getTicket controller', error.message);
            res.json({ status: "error", message: error.message });
        }
    }
    static getTicketById = async (req, res) => {
        try {
            const ticketId = req.params.id;
            const ticket = await ticketService.getTicketById(ticketId);
            logger.info('Ticket encontrado', ticket);
            res.json({ message: "Ticket encontrado", data: ticket });
            
        } catch (error) {
            logger.error('error getTiketById controller', error.message);
            res.json({ status: "error", message: error.message });
        }
    }
}