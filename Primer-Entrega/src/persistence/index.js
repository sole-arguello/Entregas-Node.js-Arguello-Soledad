import { ProductManager } from "./files/productManager.js";
import { __dirname } from "../utils.js";
import path from "path";

console.log('dirname', path.join(__dirname, '/files'));

export const productsService = new ProductManager(path.join(__dirname, '/data/products.json'));
