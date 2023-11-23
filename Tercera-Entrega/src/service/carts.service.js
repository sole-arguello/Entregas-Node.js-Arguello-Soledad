import { cartsDao } from "../dao/index.js";

export class CartsService {
    static getCarts() {
        return cartsDao.getCarts();
    }
    static getCartsId(cartId) {
        return cartsDao.getCartsId(cartId);
    }
    static createCart() {
        return cartsDao.createCart();
    }
    static addProduct(cartId, productId) {
        return cartsDao.addProduct(cartId, productId);
    }
    static updateCartId(cartId, newProduct) {
        return cartsDao.updateCartId(cartId, newProduct);
    } 
    static updateProductInCart(cartId, productId, newQuantity) {
        return cartsDao.updateProductInCart(cartId, productId, newQuantity);
    }
    static deleteCartId(cartId) {
        return cartsDao.deleteCartId(cartId);
    }
    static deleteProductInCart(cartId, productId) {
        return cartsDao.deleteProductInCart(cartId, productId);
    }
}