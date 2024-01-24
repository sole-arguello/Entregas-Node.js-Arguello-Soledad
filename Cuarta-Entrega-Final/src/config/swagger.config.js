import { __dirname } from '../utils.js';
import swaggerJsDoc from 'swagger-jsdoc';
import path from 'path';

const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: 'Documentacion api de E-commerce',
            version: '1.0.0',
            description: 'Definicion de endpoints para la API E-commerce',
        },
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                    value: 'Bearer <TOKEN>'
                },
            },
        }
    },
    apis: [
        `${path.join(__dirname, '/docs/**/*.yaml')}`,//archivo de documentacion
    ]

}

export const swaggerSpecs = swaggerJsDoc(swaggerOptions)