import mongoose from "mongoose";
import { config } from "./config.js";
import { logger } from "../helpers/logger.js";
export class connectDB {
  static #instance;

  static #getConnection() {

    let URL;

    if(config.enviroment.persistence === 'test'){
        URL = config.mongo.url_test;
    }else{
        URL = config.mongo.url;
    }

    // const URL = config.mongo.url;
    const connection = mongoose.connect(URL);
    logger.info("Conectado a la base de datos");
    return connection;
  }

  static getInstance() {
    if (this.#instance) {
      logger.info("La conexion a la base de datos ya existe");
      return this.#instance;
    } else {
      this.#instance = this.#getConnection();
      return this.#instance;
    }
  }
}
