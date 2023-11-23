
import { usersModel} from "./models/users.models.js"
export class UsersManagerMongo {

    constructor() {
        this.model = usersModel
    }

    async createUsers(userInfo) {
        try {
            const newUser = await this.model.create(userInfo);
            //mensaje interno
            console.log('createUsers con exito', newUser);          
            return newUser

        } catch (error) {
            console.log('Error en manager createUsers', error.message);
            throw new Error('No se pudo crear el usuario', error.message);
        }
        
    }
    async getUserByEmail(email){
        try {
            const user = await this.model.findOne({email})
            console.log('getUserByEmail con exito', user);
            return user
        } catch (error) {
            console.log('Error en manager getUserByEmail', error.message);
            throw new Error('El Usuario no se encuentra registrado', error.message);
        }
    }
    async getUserById(id){
        try {
            const userExist = await this.model.findById(id).lean();
            if(!userExist){
                throw new Error('El Usuario no se encuentra registrado');
            }
            console.log('getUserById con exito', userExist);
            return userExist
        } catch (error) {
            console.log('error en manager getUserById', error.message);
            throw new Error('El Usuario no se encuentra registrado', error.message);
        }
    }


}