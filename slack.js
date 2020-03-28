const express = require('express')
const app = express()
const socketIo = require('socket.io')

const namespaces = require('./data/namespaces')
// console.log(namespaces[0])

app.use(express.static(__dirname + '/public'))

app.get('/', function (req, res) { res.redirect('/chat.html') });

const port = process.env.PORT || 9000

const expressServer = app.listen(port, () => {
    console.log(`Server start at port ${port}`)
})

const io = socketIo(expressServer)

try {
    io.on('connection', (socket) => {

        // console.log(socket.handshake)

        // build an array of the namespaces
        let nsData = namespaces.map((ns) => {
            return {
                img: ns.img,
                endpoint: ns.endpoint
            }
        })
        // send the list of ns to a client whenever they connect
        socket.emit('nsList', nsData)
    })

    // loop through the namespaces to listen for connection
    namespaces.forEach((namespace) => {
        io.of(namespace.endpoint).on('connection', (nsSocket) => {
            const username = nsSocket.handshake.query.username
            nsSocket.emit('nsRoomLoad', namespace.rooms)

            nsSocket.on('joinRoom', (roomToJoin) => {
                const roomToLeave = Object.keys(nsSocket.rooms)[1];
                nsSocket.leave(roomToLeave)
                updateUsersInroom(namespace, roomToLeave)
                nsSocket.join(roomToJoin)

                const nsRoom = namespace.rooms.find((room) => room.roomTitle === roomToJoin)
                nsSocket.emit('history', nsRoom.history)
                updateUsersInroom(namespace, roomToJoin)
            })
            nsSocket.on('newMessageToServer', (msg, ack) => {
                const fullMsg = {
                    text: msg.text,
                    time: Date.now(),
                    username: username,
                    avatar: "https://via.placeholder.com/30"
                }


                const roomTitle = Object.keys(nsSocket.rooms)[1];
                const nsRoom = namespace.rooms.find((room) => room.roomTitle === roomTitle)
                nsRoom.addMessage(fullMsg)
                io.of(namespace.endpoint).to(roomTitle).emit('messageToClients', fullMsg)
                ack('success')
            })
        })
    })


    function updateUsersInroom(namespace, roomToJoin) {
        io.of(namespace.endpoint).in(roomToJoin).clients((err, clients) => {
            clients.length
            io.of(namespace.endpoint).in(roomToJoin).emit('updateMembers', clients.length)
        })
    }
} catch (error) {
    console.log(error)
}