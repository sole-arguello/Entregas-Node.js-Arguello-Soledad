import { tiketDao } from "../dao/index.js";


export class TiketService {

    static createTiket(tiketBody){
        return tiketDao.createTiket(tiketBody)
    }
    
    static getTikets(){
        return tiketDao.getTikets()
    }

    static getTiketById(tiketId){
        return tiketDao.getTiketById(tiketId)
    }
}