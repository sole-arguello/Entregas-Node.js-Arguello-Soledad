//import { cartsDao } from "../dao/index.js";

export class CartsRepository {

    constructor(dao) {
       this.dao = dao 
    }

    async getCarts() {
        return await this.dao.getCarts();
        
    }
    async getCartsId(cartId) {
        return await this.dao.getCartsId(cartId);
    }
    async createCart() {
        return await this.dao.createCart();
    }
    async addProduct(cartId, productId) {
        return await this.dao.addProduct(cartId, productId);
    }
    async updateCartId(cartId, newProduct) {
        return await this.dao.updateCartId(cartId, newProduct);
    } 
    async updateProductInCart(cartId, productId, newQuantity) {
        return await this.dao.updateProductInCart(cartId, productId, newQuantity);
    }
    async deleteCartId(cartId) {
        return await this.dao.deleteCartId(cartId);
    }
    async deleteProductInCart(cartId, productId) {
        return await this.dao.deleteProductInCart(cartId, productId);
    }

    async purchaseCart(cartId) {
        return await this.dao.purchaseCart(cartId);
    }
}