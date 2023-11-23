import { CartsService } from "../service/carts.service.js";

export class CartsController {
    static getCarts = async (req, res) => {
        try {
            const carts = await CartsService.getCarts();
            res.json({ message: "Listado de carritos", data: carts });
        } catch (error) {
            res.json({ status: "error", message: error.message });
        }
    }
    static getCartsId = async (req, res) => {
        try {
            const idcarts = req.params.cid; //obtengo el parametro cid de la URL
            //tarigo el caarito por medio de la populacion
            const carts = await CartsService.getCartsId(idcarts);
            if(carts){
              res.json({ message: "Carrito encontrado", data: carts });
            }else{
              res.json({ status: "error", message: "Carrito no encontrado"});
            }
            
          } catch (error) {
            res.json({ status: "error", message: error.message });
          }
    }
    static createCart = async (req, res) => {
        try {
            const newCart = await CartsService.createCart();
            res.json({ message: "Carrito creado", data: newCart });
        } catch (error) {
            res.json({ status: "error", message: error.message });
        }
    }
    static updateCartId = async (req, res) => {
        try {
            const { cid: idCart } = req.params; //obtengo el id del carrito
            const newProduct = req.body;//obtengo el producto
            const updatedCart = await CartsService.updateCartId(idCart, newProduct);// le paso el id y el cuerpo 
            res.json({ message: "Carrito actualizado con exito", data: updatedCart });
        }
        catch (error) {
            res.json({ status: "error",  message: error.message });
        }
    }
    static addProduct = async (req, res) => {
        try {
            const { cid: idCarts, pid: idProduct } = req.params;
            const cart = await CartsService.addProduct(idCarts, idProduct);
            res.json({ message: "Producto agregado al carrito", data: cart });
        } catch (error) {
            res.json({ status: "error", message: error.message });
        }
    }
    static updateProductInCart = async (req, res) => {
        try {
            const { cid: idCarts, pid: idProduct } = req.params;
            const newQuantity  = req.body.newQuantity;
            const updatedCart = await CartsService.updateProductInCart(idCarts, idProduct, newQuantity);
            res.json({ message: "success", data: updatedCart });
        }
        catch (error) {
            res.json({ status: "error",  message: error.message });
        }
    }
    static deleteCartId = async (req, res) => {
        try {
            const { cid: idCarts } = req.params;
            const deletedCart = await CartsService.deleteCartId(idCarts);
            res.json({ message: "Carrito eliminado con exito", data: deletedCart });
            // res.json({ message: "Carrito con id ' " + cartId + " ' eliminado con exito", data: cartDeleted });
        }
        catch (error) {
            res.json({ status: "error",  message: error.message });
        }
    }
    static deleteProductInCart = async (req, res) => {
        try {
            const { cid: idCarts, pid: idProduct } = req.params;
            const deletedProduct = await CartsService.deleteProductInCart(idCarts, idProduct);
            res.json({ message: "Producto eliminado del carrito", data: deletedProduct });
        }
        catch (error) {
            res.json({ status: "error",  message: error.message });
        }
    }
}