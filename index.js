const server = require("./api/server");

const PORT = 5000 // as needed

server.listen(PORT, () => {
    console.log('Listening Port', PORT)
})
