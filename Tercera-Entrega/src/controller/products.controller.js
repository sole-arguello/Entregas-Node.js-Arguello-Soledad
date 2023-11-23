import { ProductsService} from '../service/products.service.js'


export class ProductsController {

    static getProducts = async (req, res) => {
        try {
            const products = await ProductsService.getProducts()
            res.json({ message: "Listado de productos", data: products });
        } catch (error) {
            res.json( { status: "error", message: error.message });
        }
    }
    static getProductsId = async (req, res) => {
        try {
            const productId = req.params.id;
            const products = await ProductsService.getProductsId(productId);
            res.json({ message: "Listado de productos", data: products });
        } catch (error) {
            res.json( { status: "error", message: error.message });
        }
    }
    static createProduct = async (req, res) => {
        try {
            const product = req.body;
            const newProduct = await ProductsService.createProduct(product);
            res.json({ message: "Producto creado", data: newProduct });
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