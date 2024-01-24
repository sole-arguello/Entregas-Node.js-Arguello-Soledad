

export class UsersSessionsRepository {

    constructor(dao){
        this.dao = dao
    }

    async createUsers(infoUser){
        return await this.dao.createUsers(infoUser)
    }
    async getUserByEmail(email){
        return await this.dao.getUserByEmail(email)
    }
    async getUserById(id){
        return await this.dao.getUserById(id)
    }
    async getUsers(){
        return await this.dao.getUsers()
    }
    async updateUser(id, user){
        return await this.dao.updateUser(id, user)
    }
}