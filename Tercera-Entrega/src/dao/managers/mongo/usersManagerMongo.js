
import { usersModel} from "./models/users.models.js"
export class UsersManagerMongo {

    constructor() {
        this.model = usersModel
    }

    async createUsers(userInfo) {
        try {
            const newUser = await this.model.create(userInfo);
            return newUser
        } catch (error) {
            console.log('crear usuario', error.message);
            throw new Error('No se pudo crear el usuario', error.message);
        }
        
    }
    async getUserByEmail(email){
        try {
            const user = await this.model.findOne({email})
            return user
        } catch (error) {
            console.log('get user', error.message);
            throw new Error('El Usuario no se encuentra registrado', error.message);
        }
    }
    async getUserById(id){
        try {
            const userExist = await this.model.findById(id).lean();
            if(!userExist){
                throw new Error('El Usuario no se encuentra registrado');
            }
            return userExist
        } catch (error) {
            console.log('get user', error.message);
            throw new Error('El Usuario no se encuentra registrado', error.message);
        }
    }


}