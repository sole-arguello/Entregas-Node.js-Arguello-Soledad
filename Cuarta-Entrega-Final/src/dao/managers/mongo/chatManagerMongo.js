import { logger } from "../../../helpers/logger.js";
import { chatModel } from "./models/chat.model.js";

export class ChatManagerMongo {

    constructor(){
        this.model = chatModel
    }

    async getMessages(){
        try {
            const resultado = await this.model.find();
            return resultado 
        } catch (error) {
            logger.error('get chat', error.message);
            throw new Error('No se pudo obtener el listadp de los mensajes ', error.message);
        }
    }

    async createMessage(messageInfo){
        try {
            const resultado = await this.model.create(messageInfo);
            return resultado
        } catch (error) {
            logger.error('add message', error.message);
            throw new Error('No se pudo agragar el mensaje ', error.message);
        }
    }


}