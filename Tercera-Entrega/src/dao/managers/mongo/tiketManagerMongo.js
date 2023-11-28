import { tiketModel } from "../mongo/models/tikets.model.js";

export class TiketManagerMongo {
    constructor(){
        this.model = tiketModel
    }

    async createTiket(tiketBody){
        try {
            const tiket = await this.model.create(tiketBody);
            console.log('createTiket con exito', tiket);
            return tiket
        } catch (error) {
            console.log('Error en manager createTiket', error.message);
            throw new Error('No se pudo crear el tiket ', error.message);
        }
    }

    async getTikets(){
        try {
            const tikets = await this.model.find().lean();
            console.log('getTikets con exito', tikets);
            return tikets 
        } catch (error) {
            console.log('Error en manager getTikets', error.message);
            throw new Error('No se pudo obtener el listado de los tikets ', error.message);
        } 
    }

    async getTicketById(id){
        try {
            const tikets = await this.model.findById(id).lean();
            console.log('getTiketById con exito', tikets);
            return tikets 
        } catch (error) {
            console.log('Error en manager getTiketById', error.message);
            throw new Error('No se pudo obtener el tiket ', error.message);
        }
    }
}