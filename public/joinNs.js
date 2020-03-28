function joinNs(endpoint) {
    if (nsSocket || !username) {
        // check to see if nsSocket is actually a socket
        nsSocket.close();
    }

    let url = `http://localhost:9000${endpoint}`
    nsSocket = io(url)
    nsSocket.on('nsRoomLoad', (nsRooms) => {
        let roomList = document.querySelector('.room-list')
        roomList.innerHTML = "";
        nsRooms.forEach((room) => {
            roomList.innerHTML += `<li class="room"><span class="glyphicon glyphicon-globe"></span>${room.roomTitle}</li>`
        })

        let roomNodes = document.getElementsByClassName('room');
        Array.from(roomNodes).forEach((elem) => {
            elem.addEventListener('click', (e) => {
                joinRoom(e.target.innerText)
            })
        })

        const topRoom = document.querySelector('.room')
        const topRoomName = topRoom.innerText;
        // console.log(topRoomName)
        joinRoom(topRoomName)
    })

    nsSocket.on('messageFromServer', (dataFromServer) => {
        socket.emit('dataToServer', {
            data: "Data from client"
        })
    })

    nsSocket.on('messageToClients', (msg) => {
        const newMsg = buildHTML(msg)
        document.querySelector('#messages').innerHTML += newMsg
    })

    document.querySelector('.message-form').addEventListener('submit', (event) => {
        event.preventDefault();
        const newMessage = document.querySelector('#user-message').value;
        // console.log(newMessage)
        nsSocket.emit('newMessageToServer', ({
            text: newMessage
        }), (ack) => {
            if (ack) {
                document.querySelector('#user-message').value = ""
            }
        })
    })
}

function buildHTML(msg) {
    const convertedDate = new Date(msg.time).toLocaleString()
    const newHTML = ` 
     <li>
    <div class="user-image">
    <img src="${msg.avatar}" />
    </div>
    <div class="user-message">
    <div class="user-name-time">${msg.username} <span>${convertedDate}</span></div>
    <div class="message-text">${msg.text}</div>
    </div>
</li>`

    return newHTML
}