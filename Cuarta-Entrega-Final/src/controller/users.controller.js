import { logger } from "../helpers/logger.js";
import { usersSessionsService } from "../repositories/index.js";

export class UsersController{

    static modifyRole = async (req, res) => {
        try {
            const userId = req.params.uid.toString();
            logger.info("paso por modifyRole controller");
            const user = await usersSessionsService.getUserById(userId);
            //validar que el usuario haya subido todos los docs
            if(user.status !== 'complete'){
                res.json({ status: "error", message: "El ususrio no ha subido todos los documentos" });
            }

            //logger.info('debug user exist', user)
           if(user.role === 'premium'){
                user.role = 'user'
           }else if(user.role === 'user'){
                user.role = 'premium'
           }else{
            res.json({ status: "error", message: "No se puede cambiar el rol de este usuario" });
           }
            await usersSessionsService.updateUser(userId, user);//user._id, user
            logger.info("Rol modificado");
            res.json({ status: "success", message: "Rol modificado" });
        } catch (error) {
            logger.error("Se produjo un error en modifyRole controller", error.message);
            res.json({ status: "error", message: error.message });
        }
    }

    static uploaderUserDocuments = async (req, res) => {
        try {
            const userId = req.params.uid;
            const user = await usersSessionsService.getUserById(userId);
            //console.log('user', user)
            //console.log('documentos', req.files)
            const identification = req.files['identificacion']?.[0] || null;
            const address = req.files['domicilio']?.[0] || null;
            const statusCount = req.files['estadoDeCuenta']?.[0] || null;
            const docs = []
            if(identification) docs.push({name: 'identificacion', reference: identification.filename})
            if(address) docs.push({name: 'domicilio', reference: address.filename})
            if(statusCount) docs.push({name: 'estadoDeCuenta', reference: statusCount.filename})
            user.documents = docs

            if(docs.length <3){
                user.status = 'incomplete'
            }else{
                user.status = 'complete'
            }
            await usersSessionsService.updateUser(userId, user);
            logger.info("Documentos cargados");
            res.json({ status: "success", message: "Documentos cargados" });

        } catch (error) {
            logger.error("Se produjo un error en uploaderUserDocuments controller", error.message);
            res.json({ status: "error", message: error.message });
        }
    }
}