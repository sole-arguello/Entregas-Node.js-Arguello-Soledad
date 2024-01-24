console.log('JavaScript del lado del front');

// socket del lado del cliente
const socketClient = io();


const userName = document.getElementById('userName');//quien se conecta 
const inputMessage = document.getElementById('inputMessage');//recibir el mje del usuario
const btnSendMessage = document.getElementById('btnSendMessage');//capturar el evento y enviar mensaje
const chatPanel = document.getElementById('chatPanel');//recibo todos los mjes

let user;

Swal.fire({
    title: 'Chat',
    text: 'Por favor ingrese su nombre de usuario',
    input: 'text',
    inputValidator: (value) => {
        return !value && 'Debe ingresar un nombre de usuario';
    },
    allowOutsideClick: false,
    allowEscapeKey: false,
}).then((inputValue) => {
    user = inputValue.value;//carga el nombre
    userName.innerHTML = user;//muestro el nombre del usuario
    
})

//agrgo un evento al campo de texto
btnSendMessage.addEventListener('click', (e) => {
    e.preventDefault();
    //envio el mensaje al socket del servidor
    const message = {user: user, message: inputMessage.value};
    socketClient.emit('messageChat', message);
    //para solucionar que no llegue vacio
    inputMessage.value = '';
})

//recibo el historial de chats
socketClient.on('historyChat', (messageServer) => {
    //replico el mensaje a los usuarios
    let messageElement = ''
    messageServer.forEach(element => {
        messageElement += `
        <label cl> Mensaje de: 
            <span class="user">${element.user}</span>
        </label>
        <p class="areaChat">${element.message}</p> 
        `
    });

    chatPanel.innerHTML = messageElement
})
