import { usersDao } from "../dao/index.js";

export class UsersSessionsService {

    static createUsers(infoUser){
        return usersDao.createUsers(infoUser)
    }
    static getUserByEmail(email){
        return usersDao.getUserByEmail(email)
    }
    static getUserById(id){
        return usersDao.getUserById(id)
    }
    static getUsers(){
        return usersDao.getUsers()
    }
}