import path from "path";
import { fileURLToPath } from "url";

export const __dirname = path.dirname(fileURLToPath(import.meta.url));

//dentro del proyecto ejecuto node src/utils.js
//console.log('__dirname',__dirname);