function joinRoom(roomName) {
    nsSocket.emit('joinRoom', roomName, (newNumberOfMmebers) => {
        console.log(roomName)
        document.querySelector('.curr-room-num-users').innerHTML = `${newNumberOfMmebers} <span class="glyphicon glyphicon-user"></span>`

    })

    nsSocket.on('history', (history) => {
        console.log(history)

        const messagesUl = document.querySelector('#messages')
        messagesUl.innerHTML = "";
        history.forEach(msg => {
            const newMsg = buildHTML(msg)
            const currentMessages = messagesUl.innerHTML;
            messagesUl.innerHTML = currentMessages + newMsg
        });
        messagesUl.scrollTo(0, messagesUl.scrollHeight)
    })

    nsSocket.on('updateMembers', (numMember) => {
        document.querySelector('.curr-room-num-users').innerHTML = `${numMember} <span class="glyphicon glyphicon-user"></span>`;
        document.querySelector('.curr-room-text').innerText = `${roomName}`

    })
}