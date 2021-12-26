const mongoose = require("mongoose"),
    Schema = mongoose.Schema,
    config = require("./config.js");
 // { type: String, default: "english" }
    module.exports =  mongoose.model("guildSettings",  new Schema({
            "_id": mongoose.Schema.Types.ObjectId,
            "id": { type: String } ,
    
            "prefix": { type: String, default: config.PREFIX },
            "lang": { type: String, default: config.LANGUAGE },
            "timezone": { type: String, default: "00" },

            "music": { type: Object , default: {"vol": 100 , repeat: 0 , voiceChannel: null , djroles: []} }
        }));
    
  