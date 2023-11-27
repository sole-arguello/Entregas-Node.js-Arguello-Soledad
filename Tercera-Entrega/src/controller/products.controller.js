import { ProductsService} from '../service/products.service.js'


export class ProductsController {

    static createProduct = async (req, res) => {
        try {
            console.log('createProduct controller');
            const product = req.body;
            const newProduct = await ProductsService.createProduct(product);
            res.json({ message: "Producto creado", data: newProduct });
        } catch (error) {
            console.log('error createProduct controller', error.message);
            res.json( { status: "error", message: error.message });
        }
    }
    static getProducts = async (req, res) => {
        try {
            console.log('getProducts controller');
            const products = await ProductsService.getProducts()
            res.json({ message: "Listado de productos", data: products });
        } catch (error) {
            console.log('error getProducts controller', error.message);
            res.json( { status: "error", message: error.message });
        }
    }
    static getProductById = async (req, res) => {
        try {
            console.log('getProductById controller');
            const productId = req.params.id;
            const products = await ProductsService.getProductById(productId);
            res.json({ message: "Listado de productos", data: products });
        } catch (error) {
            console.log('error getProductById controller', error.message);
            res.json( { status: "error", message: error.message });
        }
    }
    static updateProduct = async (req, res) => {
        try {
            console.log('updateProduct controller');
            const productId = req.params.id;
            const product = req.body;
            const updatedProduct = await ProductsService.updateProduct(productId, product);
            res.json({ message: "Producto actualizado", data: updatedProduct });
        } catch (error) {
            console.log('error updateProduct controller', error.message);
            res.json( { status: "error", message: error.message });
        }
    }
    static deleteProduct = async (req, res) => {
        try {
            console.log('deleteProduct controller');
            const productId = req.params.id;
            const deletedProduct = await ProductsService.deleteProduct(productId);
            res.json({ message: "Producto eliminado", data: deletedProduct });
        } catch (error) {
            console.log('error deleteProduct controller', error.message);
            res.json( { status: "error", message: error.message });
        }
    }
}