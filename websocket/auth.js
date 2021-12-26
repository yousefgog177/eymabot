module.exports = async (bot , json , connection) =>{
if(!json.DiscordToken) return connection.send(`Invaild Discord Token`);
if(!json.EymaToken || json.EymaToken !== json.EymaToken) return connection.send(`Invaild Premium Token`);
connection.isAuth = true
connection.DiscordToken = json.DiscordToken
connection.EymaToken = json.EymaToken
connection.send("Done!")
}