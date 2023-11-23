import { chatDao } from "../dao/index.js";


export class ChatService {

    static getMessages(){
        return chatDao.getMessages()
    }
    static createMessage(messageInfo){
        return chatDao.createMessage(messageInfo)
    }
}