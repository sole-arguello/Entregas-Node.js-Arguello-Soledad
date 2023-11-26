import { TiketService } from "../service/tiket.service.js"


export class TiketController {
    
    static createTiket = async (req, res) => {
        try {
            console.log('createTiket controller');
            const tiketBody = req.body;
            const newTiket = await TiketService.createTiket(tiketBody);
            res.json({ message: "Tiket creado", data: newTiket });
            
        } catch (error) {
            res.json({ status: "error", message: error.message });
        }
    }
    static getTiket = async (req, res) => {
        try {
            console.log('getTiket controller');
            const tiket = await TiketService.getTiket();
            res.json({ message: "Listado de tikets", data: tiket });
            
        } catch (error) {
            console.log('error getTiket controller', error.message);
            res.json({ status: "error", message: error.message });
        }
    }
    static getTiketById = async (req, res) => {
        try {
            console.log('getTiketById controller');
            const tiketId = req.params.id;
            const tiket = await TiketService.getTiketById(tiketId);
            res.json({ message: "Listado de tikets", data: tiket });
            
        } catch (error) {
            console.log('error getTiketById controller', error.message);
            res.json({ status: "error", message: error.message });
        }
    }
}