import { faker } from "@faker-js/faker";

//funcion que genere 100 productos
export const generateProducts = () => {
    return {
    id: faker.database.mongodbObjectId(),
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    code: faker.random.alphaNumeric(5),
    price: parseFloat(faker.commerce.price()),
    stock: parseInt(faker.random.numeric(2)),
    thumbnails: faker.image.imageUrl(),
    status: faker.datatype.boolean(),
    category: faker.commerce.department(),
    }


}
//console.log('funcion', generateProducts())
generateProducts()

