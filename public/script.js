const username = prompt('what is your username?', `${getUsername()}`)

const socket = io('https://slack-demo-sahmmie.herokuapp.com', {
    query: {
        username: username
    }
});
let nsSocket = "";

// listen for all the ns lists
socket.on('nsList', (nsData) => {
    let nameSpaceDiv = document.querySelector('.namespaces')
    nameSpaceDiv.innerHTML = "";
    nsData.forEach((ns) => {
        nameSpaceDiv.innerHTML += `<div class="namespace" ns=${ns.endpoint}><img src="${ns.img}" /></div>`
    })

    Array.from(document.getElementsByClassName('namespace')).forEach((element) => {
        element.addEventListener('click', (e) => {
            const nsEndpoint = element.getAttribute('ns')
            joinNs(nsEndpoint)
            // console.log(nsEndpoint)
        })
    })

    joinNs('/wiki')
})

// generate random string
function getUsername() {
    let string = 'slack-'
    let allowedChars = "abcdefghijklmnopqrstuvwxyz";
    for (var i = 0; i < 6; i++) {
        string += allowedChars.charAt(Math.floor(Math.random() * allowedChars.length));
    }
    return string
}