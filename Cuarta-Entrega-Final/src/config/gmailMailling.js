import nodemailer from "nodemailer";
import { config } from "./config.js";

export const transporter = nodemailer.createTransport({
    service: 'gmail',
    //host: 'smtp.gmail.com',
    port: 587,
    auth: {
        user: config.gmail.account,
        pass: config.gmail.password
    },

    secure: false,
    tls: {
        rejectUnauthorized: false
    }
})