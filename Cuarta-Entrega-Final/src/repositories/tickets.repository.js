

export class TicketsRepository {

    constructor(dao){
        this.dao = dao
    }

    async createTicket(ticketBody){
        return await this.dao.createTicket(ticketBody)
    }
    
    async getTickets(){
        return await this.dao.getTickets()
    }

    async getTiketById(ticketId){
        return await this.dao.getTiketById(ticketId)
    }
}