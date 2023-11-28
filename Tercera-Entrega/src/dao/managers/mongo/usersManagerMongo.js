import { usersModel} from "./models/users.models.js"
import { UsersDto } from "../../dto/user.dto.js"
export class UsersManagerMongo {

    constructor() {
        this.model = usersModel
    }
    async createUsers(userInfo) {
        try {
            const newUserDto = new UsersDto(userInfo);
            console.log('Usuario Dto', newUserDto);
            const newUser = await this.model.create(newUserDto);
            //mensaje interno
            console.log('createUsers con exito');          
            return newUser

        } catch (error) {
            console.log('Error en manager createUsers', error.message);
            throw new Error('No se pudo crear el usuario', error.message);
        }
        
    }
    async getUserByEmail(email){
        try {
            const user = await this.model.findOne({email})
            console.log('getUserByEmail ok');
            return user
        } catch (error) {
            console.log('Error en manager getUserByEmail', error.message);
            throw new Error('El Usuario no se encuentra registrado', error.message);
        }
    }
    async getUserById(id){
        try {
            const userExist = await this.model.findById(id).lean();
            console.log('getUserById ok', userExist);
            if(!userExist){
                console.log('error en manager getUserById');
                throw new Error('El Usuario no se encuentra registrado');
            }
            
            console.log('getUserById con exito', userExist);
            return userExist
        } catch (error) {
            console.log('error en manager getUserById', error.message);
            throw new Error('El Usuario no se encuentra registrado', error.message);
        }
    }
    async getUsers(){
        
        try {
            const users = await this.model.find();
            console.log('getUsers con exito');
            return users
        } catch (error) {
            console.log('error en manager getUsers', error.message);
            throw new Error('Los usuario no se encontraron', error.message);
        }
    }

}