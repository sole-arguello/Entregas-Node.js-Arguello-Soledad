
export class ChatRepository {

    constructor(dao){
        this.dao = dao
    }

    async getMessages(){
        return await this.dao.getMessages()
    }
    async createMessage(messageInfo){
        return await this.dao.createMessage(messageInfo)
    }

    //emptyChat
}