import dotenv from 'dotenv';
dotenv.config()

export const config = {

    tokenJWT: {
      tokenJWT_Key: process.env.PRIVATE_KEY,  
    },
    
    mongo: {
        url: process.env.MONGO_URL
    },
    
    github: {
        callbackUrl: process.env.GITHUB_CALLBACK_URL,
        clientId: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }
}
