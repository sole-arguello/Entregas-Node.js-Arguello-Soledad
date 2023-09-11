import { ProductManagerFile } from "./files/porudctManagerFile.js";
import { CartsManagerFiles } from './files/cartsManagerFiles.js'
import { __dirname } from "../utils.js";
import path from "path";

console.log('dirname', path.join(__dirname, '/files'));

export const productsService = new ProductManagerFile(path.join(__dirname, '/data/products.json'));
export const cartsService = new CartsManagerFiles(path.join(__dirname, '/data/carts.json'));