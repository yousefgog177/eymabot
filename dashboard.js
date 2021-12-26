const fs = require("fs")
const http = require('http');
const websocketServer = require("./websocket")

const express = require("express")
const session = require("express-session");
const bodyParser = require("body-parser");
const MongoStore = require('connect-mongo')(session);
const fetch = require("node-fetch")

module.exports = async (bot , port = 3000 ,ws = false) =>{

const app = express();

const server = http.createServer(app);

if(ws) {
websocketServer.run(bot , server)
}

bot.http = server
bot.app = app


server.listen(port)  
}