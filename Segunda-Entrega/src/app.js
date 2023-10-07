import express from 'express';

import { productsRoutes } from './routes/products.routes.js';
import { cartsRouter } from './routes/carts.routes.js';

const port = 8080;
const app = express();
app.use(express.json());

//rutas
app.use("/api/products", productsRoutes);
app.use("/api/carts", cartsRouter)


app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`);
})