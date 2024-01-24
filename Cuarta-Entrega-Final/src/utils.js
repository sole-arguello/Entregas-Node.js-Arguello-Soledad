import path from "path";
import multer from "multer"
import { fileURLToPath } from "url";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { config } from "./config/config.js";

export const __dirname = path.dirname(fileURLToPath(import.meta.url));

export const generateToken = (user) => {
    const token = jwt.sign(
        {
        _id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        age: user.age,
        email: user.email,
        role: user.role,
        documents: user.documents,
        last_connection: user.last_connection
        },
        config.tokenJWT.tokenJWT_Key,
        { expiresIn: '12h' }
    )
    return token
}

export const cookieExtractor = (req) => {
    let token;
    if (req && req.cookies) {
        token = req.cookies['cookieLogin'];

    }else{
        token = null
    }
    return token
}

export const createHash = (password) => {//recibo la contraseña del form
    const salt = bcrypt.genSaltSync(10);//crea el algoritmo
    const hash = bcrypt.hashSync(password, salt);//recibe la contraseña y el algoritmo
    return hash
    
}

//funcion para comparar los hash
export const isValidPassword = (password, user) => {//recibe la contraseña nueva y los datos del usuario
    return bcrypt.compareSync(password, user.password)
}

//filtro para subir imagenes
const profileMulterFilter = (req, file, cb) => {
    if(!checkValidFileds(req.body)){
        cb(null, false)
    }
    cb(null, true)
}

//funcion para validar los campos
const checkValidFileds = () =>{
    const { first_name, email, password } = user
    if(!first_name || !email || !password){
        return false
    }
    return true
}

//configuro multer para guardar las imagenes de los usuarios
const profileStorage = multer.diskStorage({
    //donde guardo las img
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '/assets/users/img'))
    },
    //el nombre con que voy a guardar las imagenes
    filename: function (req, file, cb) {
        cb(null, `${req.body.email}-perfil-${file.originalname}`)
    }
})
//uploader para las imagenes
export const uploadProfile = multer({ storage: profileStorage, fileFilter: profileMulterFilter })

//configurar multer para guardar los documentos de los usuarios
const documentsStorage = multer.diskStorage({
    //donde guardo las img
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '/assets/users/documents'))
    },
    //el nombre con que voy a guardar las imagenes
    filename: function (req, file, cb) {
        cb(null, `${req.user.email}-document-${file.originalname}`)
    }
})
//uploader para las imagenes
export const uploadDocuments = multer({ storage: documentsStorage })

//configuro multer para guardar las imagenes de los productos
const imgProductStorage = multer.diskStorage({
    //donde guardo las img
    destination: function (req, file, cb) {
        cb(null, path.join(__dirname, '/assets/products/img'))
    },
    //el nombre con que voy a guardar las imagenes
    filename: function (req, file, cb) {
        cb(null, `${req.body.code}-product-${file.originalname}`)
    }
})
//uploader para las imagenes
export const uploadImgProduct = multer({ storage: imgProductStorage })




