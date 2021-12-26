const ws = require("ws")

const wsFunc = require("./websocket/func")


module.exports.run = (bot , httpServer) => {
const websocket = new ws.Server({ server:httpServer });
bot.websocketServer = websocket

websocket.on("connection" , (connection, req , client) =>{
connection.send(`Welcome to Eymabot's premium websocket
to auth send a prove with json like
{"DiscordToken": "" , "EymaToken": "" , type: 1}
Note: you will auto remove from the websocket in 30 sec if you don't send the prove!`)

connection.on("message" , (message) => {
let json;
console.log(message)

try { json = JSON.parse(message) } catch { return connection.send(`Invaild Json`) }


if(!json.type) return connection.send(`Invaild Code`)
if(json.type === 1) return wsFunc.auth(bot , json , connection)
})

setTimeout(() =>{
if(!connection.isAuth) return connection.close()} , 2000)
})

}