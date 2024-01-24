import { usersModel} from "./models/users.models.js"
import { logger } from "../../../helpers/logger.js";
export class UsersManagerMongo {

    constructor() {
        this.model = usersModel
    }
    async createUsers(userInfo) {
        try {
            // const newUserDto = new UsersDto(userInfo);
            // console.log('Usuario Dto', newUserDto);
            const newUser = await this.model.create(userInfo);
            //mensaje interno
            logger.info('paso por manager createUsers');          
            return newUser

        } catch (error) {
            logger.error('Error en manager createUsers', error.message);
            throw new Error('No se pudo crear el usuario', error.message);
        }
        
    }
    async getUserByEmail(userEmail){
        try {
            const user = await this.model.findOne({email: userEmail}).lean();
            logger.info('paso por manager getUserByEmail');
            return user
        } catch (error) {
            logger.error('Error en manager getUserByEmail', error.message);
            throw new Error('El Usuario no se encuentra registrado', error.message);
        }
    }
    async getUserById(id){
        //console.log(id)
        try {
            const userExist = await this.model.findById({_id: id}).lean();
            logger.info('paso por manager getUserById');
            if(!userExist){
                logger.error('error en manager getUserById');
                throw new Error('El Usuario no se encuentra registrado');
            }
            return userExist
        } catch (error) {
            logger.error('error en manager getUserById', error.message);
            throw new Error('El Usuario no se encuentra registrado', error.message);
        }
    }
    async getUsers(){
        
        try {
            const users = await this.model.find();
            logger.info('paso por manager getUsers');
            return users
        } catch (error) {
            logger.error(error.message);
            throw new Error('Los usuario no se encontraron', error.message);
        }
    }

    async updateUser(id, user){
        try {
            const updateUser = await this.model.findByIdAndUpdate(id, user, {new: true});
            return updateUser
        } catch (error) {
            logger.error(error.message)
            throw new Error('No se pudo actualizar el usuario', error.message)
        }
    }

}