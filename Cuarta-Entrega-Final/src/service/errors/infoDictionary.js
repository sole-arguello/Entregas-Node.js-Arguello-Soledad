export const generateUserErrorInfo = (user) =>{

    return `Error al crear el usuario - registro incompleto.
    Datos que son obligatorios:
    * Nombre: debe ser un string, se recibio ${user.first_name}
    * Apellido: debe ser un string, se recibio ${user.last_name}
    * Email: debe ser un string, se recibio ${user.email}
    * Password: debe ser un string, se recibio ${user.password}
    
    Datos que son opcionales:
    * Edad: debe ser un number, se recibio ${user.age}
    `
}

export const generateProductErrorInfo = (product) =>{
    return ` Error al crear el producto - campos incompletos.

    Datos requeridos:
    * Titulo: es un string, se recibio ${product.title}
    * Descripcion: debe ser un string, se recibio ${product.description}
    * Precio: debe ser un number, se recibio ${product.price}
    * Codigo: debe ser un string, se recibio ${product.code}
    * Stock: debe ser un number, se recibio ${product.stock}
    * Categoría: debe ser un string, se recibio ${product.category}
    
    Datos opcionales:
    * Imagen: debe ser un string, se recibio ${product.thumbnail}
    `
}

export const generateLoginErrorInfo = (user) =>{

    return `Error en login.
    Datos requeridos:
    * Email: debe ser un string, se recibio ${user.email}
    * Password: debe ser un string, se recibio ${user.password}
    `
    
}

export const generateTiketErrorInfo = (tiket) =>{
    return `Error al generar el tiket.
    Datos requeridos:

    * Codigo: debe ser un string, se recibio ${tiket.code}
    * Fecha y Hora de la compra: debe ser un number, se recibio ${tiket.date}
    * Total: debe ser un number, se recibio ${tiket.total}
    * Comprador: debe ser un string, se recibio ${tiket.purchaser}

    `
}

