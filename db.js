const config = require("./config.js")
const mongoose = require("mongoose")

module.exports = () => {
    const dbOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      autoIndex: false,
      reconnectTries: Number.MAX_VALUE,
      reconnectInterval: 500,
      poolSize: 5,
      connectTimeoutMS: 10000,
      family: 4
    };
    
    mongoose.connect(config.MONGODB, dbOptions)
    mongoose.Promise = global.Promise;
    
    mongoose.connection.on('connected', () =>{
      console.log('Mongoose has successfully connected!')
    });
    
    mongoose.connection.on('err', err => {
      console.error(`Mongoose connection error: \n${err.stack}`)
    });
    
    mongoose.connection.on('disconnected', () =>{
      console.warn('Mongoose connection lost')
    });
  }