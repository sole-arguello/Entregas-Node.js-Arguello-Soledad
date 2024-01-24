
export class ProductsRepository {

    constructor(dao) {
        this.dao = dao
     }

    async getProductsPaginate(query, options) {
        return await this.dao.getProductsPaginate(query, options);
    }
    async createProduct(infoProduct) {
        return await this.dao.createProduct(infoProduct);
    }
    async getProducts() {
        return await this.dao.getProducts();
    }
    async getProductById(prodcutId) {
        return await this.dao.getProductById(prodcutId);
    }
    async updateProduct(prodcutId, newProduct) {
        return await this.dao.updateProduct(prodcutId, newProduct);
    }
    async deleteProduct(prodcutId) {
        return await this.dao.deleteProduct(prodcutId);
    }
}