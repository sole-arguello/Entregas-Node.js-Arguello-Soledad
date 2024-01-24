import dotenv from 'dotenv';
import { Command } from 'commander';

dotenv.config()
const program = new Command();

program
    .option('--port <port>', 'Puerto de ejecucion', '3000')
    .option('--mode <mode>', 'Entorno de desarrollo', 'development')
    .option('--mode <mode>', 'Entorno de prueba', 'test')
    .parse();

const persistenceMode = program.opts().mode;
const port = program.opts().port;

export const config = {

    server: {
        port: port,
    },

    mongo: {
        url: process.env.MONGO_URL,
        url_test: process.env.MONGO_URL_TEST
    },

    tokenJWT: {
      tokenJWT_Key: process.env.PRIVATE_KEY,  
    },
    
    github: {
        callbackUrl: process.env.GITHUB_CALLBACK_URL,
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
    },
    gmail: {
        account: process.env.GMAIL_ACCOUNT,
        password: process.env.GMAIL_PASSWORD,
        secretToken: process.env.TOKEN_EMAIL
    },
    enviroment: {
        persistence: persistenceMode,
    }
}
//console.log('config', config)
