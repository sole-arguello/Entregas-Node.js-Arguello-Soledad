import express from 'express';

import { productsRoutes } from './routes/products.routes';

const port = 8080;
const app = express();

//rutas
app.use("/api/products", productsRoutes);


app.listen(port, () => {
    console.log(`app listening at http://localhost:${port}`);
})