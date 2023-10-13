const addToCart = async (productId) =>{
    try {
        let cartId = '6525e395443bd76c765dd0ee'
        const response = await fetch(`/api/carts/${cartId}/product/${productId}`, {
            method:  'PUT',
        }).then((response) =>{
            if(response.status === 200){
                window.location.href = `/cart/${cartId}`;
                console.log('Producto agregado al carrito');
            }else{
                console.error('Error al agregar el producto al carrito');
            }
        })
        

    } catch (error) {
        console.error('Error al agregar el producto al carrito', error.message);
    }


}