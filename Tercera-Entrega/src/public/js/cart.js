const deleteProduct = async (productId) =>{
    try {

        let cartId = '6525e395443bd76c765dd0ee'
        const response = await fetch(
            `/api/carts/${cartId}/products/${productId}`, 
            {
            method: 'DELETE',
            }
        ).then((response) => {
            if (response.status === 200) {
                const result = response.json()
                location.reload()
                console.log('Producto eliminado del carrito');
            }
            else{
                console.error('Error al eliminar el producto del carrito');
            }
        })
    } catch (error) {
        console.error('Error al eliminar un producto:', error.message);
    }

}