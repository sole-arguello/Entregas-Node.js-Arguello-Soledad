import {Router } from 'express';
import { productsService } from '../dao/index.js';


const router = Router();

router.get('/', async (req, res) => {
    try {
        const resultado = await productsService.getProducts();
        res.json({ status: 'success ', data: resultado });
    } catch (error) {
        res.json({ status: 'error',  message: error.message });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const resultado = await productsService.getProductById(id);
        res.json({ status: 'success', data: resultado });
    }
    catch (error) {
        res.json({ status: 'error',  message: error.message });
    }
})

router.post('/', async (req, res) => {
    try {
        const product = req.body;
        const resultado = await productsService.createProduct(product);
        res.json({ status: 'success', data: resultado });
    } catch (error) {
        res.json({ status: 'error',  message: error.message });
    }
})

router.put('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const product = req.body;
        const resultado = await productsService.updateProduct(id, product);
        res.json({ status: 'success', data: resultado });
    }
    catch (error) {
        res.json({ status: 'error',  message: error.message });
    }
})

router.delete('/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const resultado = await productsService.deleteProduct(id);
        res.json({ status: 'success', data: resultado });
    }
    catch (error) {
        res.json({ status: 'error',  message: error.message });
    }
})

export { router as productsRouter }