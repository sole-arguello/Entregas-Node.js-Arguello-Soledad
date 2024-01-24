import fs from "fs";
import { logger } from "../../../helpers/logger.js";
export class CartsManagerFs {
  constructor(path) {
    this.carts = [];
    this.pathFile = path;
  }
  fileExist() {
    return fs.existsSync(this.pathFile);
  }

  //metodo para buscar todos los carritos
  async getCarts() {
    try {
      if (this.fileExist()) {
        const dataCarts = await fs.promises.readFile(this.pathFile, "utf-8");
        return JSON.parse(dataCarts);
      } else {
        logger.error("No es posible leer el archivo");
        throw new Error("No es posible obtener los carritos");
      }
    } catch (error) {
      logger.error(error.message);
      throw error;
    }
  }
  //metodo que busca por id
  async getCartsById(id) {
    try {
      //leo el archivo
      const carts = await this.getCarts();
      //busco por id
      const cartFound = carts.find((prod) => prod.id === id);
      if (cartFound) {
        return cartFound;
      } else {
        logger.error("Carrito no encontrado");
        throw new Error("Carrito no encontrado");
      }
    } catch (error) {
      logger.error(error.message);
      throw new Error("El Carrito es inexistente");
    }
  }
  //metodo que lee y crea los carritos
  async createCart() {
    try {
      // Lee los carritos existentes
      const carts = await this.getCarts();

      // Crea un nuevo ID autoincremental para el carrito
      let newId;
      if (carts.length === 0) {
        newId = 1;
      } else {
        newId = carts[carts.length - 1].id + 1;
      }
      //creo el carrito con el id y el producto vacio
      const newCart = {
        id: newId,
        products: [],
      };
      carts.push(newCart);
      // Sobrescribe el JSON con los carritos actualizados
      await fs.promises.writeFile(this.pathFile, JSON.stringify(carts, null, "\t"));
      //retorno el carrito cargado
      return newCart;
    } catch (error) {
      logger.error(error.message);
      throw new Error("No es posible crear el carrito");
    }
  }
  //metodo para agregar productos al carrito
  async addProduct(cartId, productId, quantity) {
    try {
      //leo el archivo
      const carts = await this.getCarts();
      //busco el carrito por id
      const cartFound = carts.find((prod) => prod.id === cartId);
      if (cartFound) {
        //si existe el carrito, busco el producto por id
        const productFound = cartFound.products.find((prod) => prod.id === productId);
        if(productFound) {
          //si existe el producto, se suma la cantidad
          productFound.quantity += quantity;
        }else{
          //si NO existe el producto, se agrega al carrito
          cartFound.products.push({ 
            id: productId,
             quantity: quantity
            });
        }
        //sobreescribo el archivo guardando los cambios
        await fs.promises.writeFile(this.pathFile, JSON.stringify(carts, null, "\t"))
        return cartFound
        
      } else {
        logger.error("El carrito no existe");
        throw new Error("El carrito no existe");
      }
    } catch (error) {
      logger.error(error.message);
      throw error;
    }
  }
}
