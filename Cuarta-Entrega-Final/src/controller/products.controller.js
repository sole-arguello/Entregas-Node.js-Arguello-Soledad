import { productsService} from '../repositories/index.js'
import { CustomError } from '../service/errors/customErrors.js';
import { generateProductErrorInfo } from '../service/errors/infoDictionary.js';
import { EError } from '../service/errors/enums.js';
import { logger } from '../helpers/logger.js';

export class ProductsController {

    static createProduct = async (req, res, next) => {
        try {
            logger.info('paso por createProduct controller - Rol: ', req.user);
            const { title, description, code, price, stock, category, thumbnail } = req.body;
            if (!title || !description || !code || !price || !stock || !category || !thumbnail) {
                CustomError.createError({
                    name: "Error al crear el producto",
                    cause: generateProductErrorInfo(req.body),
                    message: "Campos incompletos",
                    code: EError.INVALID_TYPES_ERROR
                })
            }
            const productInfo = req.body;
            productInfo.owner = req.user._id;
            const newProduct = await productsService.createProduct(productInfo);
            res.json({ status: 'success', message: "Producto creado", data: newProduct });
        } catch (error) {
            logger.error('Se produjo un error en createProduct controller: ', { message: error.message});
            next(error);
            // throw error;
        }
    }
    static getProducts = async (req, res) => {
        try {
            logger.info('paso por getProducts controller');
            const products = await productsService.getProducts()
            res.json({ message: "Listado de productos", data: products });
        } catch (error) {
            logger.error('Se produjo un error en getProducts controller: ', { message: error.message});
            res.json( { status: "error", message: error.message });
        }
    }
    static getProductById = async (req, res) => {
        try {
            const productId = req.params.id;
            const products = await productsService.getProductById(productId);
            logger.info('Producto encontrado ', products);
            res.json({status: 'success', message: "Producto encontrado", data: products });

        } catch (error) {
            logger.error('Se produjo un error en getProductById controller: ', { message: error.message});
            res.json( { status: "error", message: error.message });
        }
    }
    static updateProduct = async (req, res) => {
        try {
            
            const productId = req.params.id;
            const product = req.body;
            const updatedProduct = await productsService.updateProduct(productId, product);
            logger.info('Producto actualizado', updatedProduct);
            res.json({ message: "Producto actualizado", data: updatedProduct });
        } catch (error) {
            logger.error('error updateProduct controller: ', { message: error.message});
            res.json( { status: "error", message: error.message });
        }
    }
    static deleteProduct = async (req, res) => {
        try {
            const productId = req.params.id;
            //console.log('debug productId', productId)
            const product = await productsService.getProductById(productId);
           // console.log('debug product', product)
            const user = req.user.role;
            //console.log('debug user', user)
            const userPremium = req.user._id.toString() ;
            //console.log('debug userPremium', userPremium)
            const productOwner = product.owner.toString();
            //console.log('debug productOwner', productOwner)
            //no me funciono
           // if((user === 'premium' && product.owner === userPremium) || user === 'admin') 
            if((productOwner === userPremium) || user === 'admin'){
                await productsService.deleteProduct(productId);
                logger.info('Producto eliminado');
                res.json({status: "success", message: "Producto eliminado" });
            }else{
                logger.error('No tienes permisos para eliminar este producto');
                res.json({status: "error", message: "No tienes permisos para eliminar este producto" });
            }
            // const deletedProduct = await productsService.deleteProduct(productId);
            // logger.info('Producto eliminado', deletedProduct);
            // res.json({ message: "Producto eliminado", data: deletedProduct });
        } catch (error) {
            logger.error('error deleteProduct controller: ', { message: error.message});
            res.json( { status: "error", message: error.message });
        }
    }
}

                // CustomError.createError({
                //     name: "Error al eliminar el producto",
                //     cause: generateProductErrorInfo(req.body),
                //     message: "No eres administrador",
                //     code: EError.INVALID_TYPES_ERROR
                // })