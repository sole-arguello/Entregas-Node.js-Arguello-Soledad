import { ProductsService} from '../service/products.service.js'


export class ProductsController {

    static createProduct = async (req, res) => {
        try {
            const product = req.body;
            const newProduct = await ProductsService.createProduct(product);
            res.json({ message: "Producto creado", data: newProduct });
        } catch (error) {
            res.json( { status: "error", message: error.message });
        }
    }
    static getProducts = async (req, res) => {
        try {
            const products = await ProductsService.getProducts()
            res.json({ message: "Listado de productos", data: products });
        } catch (error) {
            res.json( { status: "error", message: error.message });
        }
    }
    static getProductById = async (req, res) => {
        try {
            const productId = req.params.id;
            const products = await ProductsService.getProductById(productId);
            res.json({ message: "Listado de productos", data: products });
        } catch (error) {
            res.json( { status: "error", message: error.message });
        }
    }
    static updateProduct = async (req, res) => {
        try {
            const productId = req.params.id;
            const product = req.body;
            const updatedProduct = await ProductsService.updateProduct(productId, product);
            res.json({ message: "Producto actualizado", data: updatedProduct });
        } catch (error) {
            res.json( { status: "error", message: error.message });
        }
    }
    static deleteProduct = async (req, res) => {
        try {
            const productId = req.params.id;
            const deletedProduct = await ProductsService.deleteProduct(productId);
            res.json({ message: "Producto eliminado", data: deletedProduct });
        } catch (error) {
            res.json( { status: "error", message: error.message });
        }
    }
}