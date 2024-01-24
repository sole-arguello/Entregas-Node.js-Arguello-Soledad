import fs from 'fs';
import { logger } from '../../../helpers/logger.js';

export class ProductManagerFs{
    //filePath contiene la ruta del Json
    constructor(filePath) {
        this.products = [];
        this.filePath = filePath;
    }
    //verifico que exista el archivo
    fileExist() {
        return fs.existsSync(this.filePath);
    }
    //metodo que lee y trae los productos
    async getProducts() {
        try {
            if (this.fileExist()) {
                const data = await fs.promises.readFile(this.filePath, 'utf-8');
                //transfoma de string a json
                return JSON.parse(data);
            } else {
                logger.error('No es posible leer el archivo');
                throw new Error('No es posible leer el archivo');
            }
        } catch (error) {
            logger.error(error.message)
            throw error;
        }
    }
    //metodo que busca por id
    async getProductById(id){ 

        try {
            //leo el archivo
            const products = await this.getProducts();
            //busco por id
            const prodFound = products.find(prod => prod.id === id)
            if(prodFound) {
                return prodFound
            }
            else{
                logger.error('El producto no existe');
                throw new Error('Producto no encontrado');
            }
            
        } catch (error) {
            logger.error(error.message);
            throw new Error ('El producto es inexistente')
        }

    }
    //metodo que lee y agrega productos
    async createProduct(infoProduct) {
        try {
            //verifico que los campos se carguen obligatoriamente
            if (!infoProduct.title || !infoProduct.description || !infoProduct.price || 
                !infoProduct.thumbnail || !infoProduct.code || !infoProduct.stock 
                || !infoProduct.category) {
                logger.error('Todos los campos son obligatorios');
                throw new Error('Todos los campos son obligatorios');
                
            }
            //leo el producto en el archivo
            const products = await this.getProducts();
            
            //creo el id autoincremental
            let newId;
            if (products.length === 0) {
                newId = 1
            } else {
                newId = products[products.length - 1].id + 1;
            }
            
            //verifico si el codigo se repite y no lo agrego
            const codeExist = products.some( prod => prod.code === infoProduct.code)
            if(codeExist){
                //alert("El codigo " + infoProduct.code + " ya existe, no sera agregado nuevamente")
                logger.info('el codigo ' + infoProduct.code + ' ya existe, no sera agregado nuevamente');
                return "El codigo " + infoProduct.code + " ya existe, no sera agregado nuevamente"

            } else{
                infoProduct.id = newId
                products.push(infoProduct);
            }
            //sobreescribo el con el nuevo producto el archivo
            await fs.promises.writeFile(this.filePath, JSON.stringify(products, null, '\t'));
            logger.info('Producto creado con exito');
            return infoProduct

            
        } catch (error) {
            logger.error(error.message);
            throw error;
        }
    }

    //metodo que actualiza
    async updateProduct(id, product) {
        try {
            // Leer la lista de productos existentes
            const products = await this.getProducts();
            
            // Buscar el índice del producto que se va a actualizar
            const updateIndex = products.findIndex(prod => prod.id === id);
    
            if (updateIndex === -1) {
                logger.error('El producto no existe');
                throw new Error('Producto no encontrado');
            }
    
            // Verificar si el campo 'id' está presente en el objeto 'product'
            if (product.hasOwnProperty('id') && product.id !== id) {
                logger.error('No está permitido modificar el ID del producto.');
                throw new Error('No está permitido modificar el ID del producto.');
            }
            // Actualizar los campos del producto con los nuevos valores (excepto el ID)
            products[updateIndex] = {
                ...products[updateIndex],
                ...product
            };
    
            // Sobrescribir el JSON con los productos actualizados
            await fs.promises.writeFile(this.filePath, JSON.stringify(products, null, '\t'));
            logger.info('Producto actualizado con éxito');
            return products[updateIndex];
        } catch (error) {
            logger.error(error.message);
            throw new Error('Archivo inexistente o no se puede actualizar');
        }
    }

    //metodo eliminar producto
    async deleteProduct(id) {
        try {
            //leo el archivo
            const products = await this.getProducts()
            //verifico si exite el id
            const existId = products.find(prod => prod.id === id)
            if(existId){
                //busco el producto a eliminar
                const deleteId = products.filter(prod => prod.id !== id);
                //sobreescribo el archivo sin el 
                await fs.promises.writeFile(this.filePath, JSON.stringify(deleteId, null, '\t'));
                logger.info('Producto eliminado con exito');
            } else {
                logger.error('El producto no existe');
                throw new Error('Producto no encontrado');
            }
        } catch (error) {
            logger.error(error.message);
            throw new Error('El Producto a eliminar es inexistente');
        }
    }

}