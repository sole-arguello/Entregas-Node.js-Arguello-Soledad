import { app } from '../src/app.js'
import { expect } from 'chai'
import supertest from 'supertest' 
import { usersModel } from '../src/dao/managers/mongo/models/users.models.js'
import { describe } from 'node:test'

const request = supertest(app);

describe('Testing de ecommerce', () => {
    let sessionCookie;
    let cartID
    let createdProductID;

    before(async function(){
        await usersModel.deleteMany({})
    })


    describe('Test de usuarios', () => {
       
        it('El endpoint de Post /api/sessions/register debe registrar un usuario', async function () {
            const newUser = {
                first_name: 'test',
                last_name: 'test',
                email: 'tester@test.com',
                age: 10,
                password: 'testPassword123',
                role: 'admin'
            }
            const  registerResponse = await request.post('/api/sessions/register').send(newUser);
            //console.log('Respuesta ----', registerResponse)
            expect(registerResponse.status).to.be.equal(200);
        })
        it('Debe loguearse con email y password', async function () {
            const userTest = {
                email: "tester@test.com",
                password: "testPassword123"
            }
            const loginResponse = await request.post('/api/sessions/login').send(userTest);
            //console.log('loginResponse---', loginResponse)
    
            sessionCookie = loginResponse.headers['set-cookie'][0].split(';')[0];
            const cookieName = sessionCookie.split('=')[0];
            const cookieValue = sessionCookie.split('=')[1];
    
            expect(loginResponse.status).to.be.eql(200);
            expect(cookieName).to.be.equal('cookieLogin');
            expect(cookieValue).to.be.ok;
    
        });
    
        it('Debe comprobar la sesion del usuario', async function () {
            const checkSessionResponse = await request.get('/profile?test=true').set('Cookie', sessionCookie);
            //console.log('checkSessionResponse---', checkSessionResponse)
            expect(checkSessionResponse.status).to.be.equal(200);
            expect(checkSessionResponse._body.body).to.have.property('_id');
            expect(checkSessionResponse._body.body).not.to.have.property('password');
            cartID = checkSessionResponse._body.body.cart
            //console.log('Cart id', cartID)
    
        });
    
    })

    describe('Testing de Productos', () => {
       
    
       it('POST --> Debe crear un nuevo producto', async function () {
           const newProduct = {
               title: "test_product",
               description: "Descripción de prueba",
               price: 100,
               code: "TEST_CODE_PRODUCT_",
               stock: 50,
               category: "conjunto",
               status: true,
               thumbnail: [
                   "img.png"
               ]
           }
   
           const response = await request.post('/api/products/').set('Cookie', sessionCookie).send(newProduct);
           //console.log('Respuesta ----', response)
   
           expect(response.status).to.be.equal(200);
           createdProductID = response._body._id;
           console.log('Product id', createdProductID)

       });
   
    //    it('GET --> Debe consultar el producto creado', async function () {
    //        const response = await request.get(`/api/products/${createdProductID}`);
    //        console.log('Respuesta ----', response)
    //        expect(response.status).to.be.equal(200);
    //        expect(response._body._id).to.be.equal("65980fe0cfd1755d2bbcf4aa");
    //    });
   
    //    it('PUT -->Debe editar la cantidad en stock del producto', async function () {
    //        const updatedProductData = {
    //            stock: 60
    //        };
   
    //        const response = await request.patch(`/api/products/${createdProductID}`).set('Cookie', sessionCookie).send(updatedProductData);
    //        expect(response.status).to.be.equal(200);
    //        const getProduct = await request.get(`/api/products/${createdProductID}`);
    //        expect(getProduct._body.stock).to.be.equal(60);
    //    });
    })

    // describe('Testing de Carts', () => {
   
    //    it('PUT --> Debe ingresar un producto en el carrito del usuario', async function () {
           
    //         const quantity = {
    //             quantity:10
    //         }

    //         const addProduct = await request.put(`/api/carts/${cartID}/product/${createdProductID}`).set('Cookie', sessionCookie).send(quantity);
            
            
            
    //         expect(addProduct.status).to.be.eql(200);
    //         expect(addProduct._body.cart.products).to.be.an('array').that.is.not.empty;

    //     })

    //     it('GET --> Comprueba el carrito', async function () {
    //         const cart = await request.get(`/api/carts/${cartID}`).set('Cookie', sessionCookie);
            
    //         expect(cart.status).to.be.equall(200);
    //         expect(cart._body.payload.products).to.be.an('array');
    //     })

    //     it('DELETE --> Vacía el carrito', async function () {
    //         const cart = await request.delete(`/api/carts/${cartID}`).set('Cookie', sessionCookie);
            
    //         expect(cart.status).to.be.equal(200);
    //         expect(cart._body.cart.products).to.be.an('array').that.is.empty;

    //     })
    // })
})

