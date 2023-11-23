import { productsDao } from "../dao/index.js";

export class ProductsService {
    static getProductsPaginate(query, options) {
        return productsDao.getProductsPaginate(query, options);
    }
    static createProduct(infoProduct) {
        return productsDao.createProduct(infoProduct);
    }
    static getProducts() {
        return productsDao.getProducts();
    }
    static getProductById(prodcutId) {
        return productsDao.getProductById(prodcutId);
    }
    static updateProduct(prodcutId, newProduct) {
        return productsDao.updateProduct(prodcutId, newProduct);
    }
    static deleteProduct(prodcutId) {
        return productsDao.deleteProduct(prodcutId);
    }
}