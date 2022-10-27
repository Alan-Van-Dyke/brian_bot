const Mongoose = require('mongoose')
const guildSchema = new Mongoose.Schema({
    _id: Mongoose.Schema.Types.ObjectId,
    guildId: String,
    guildName: String,
    todoItems: [{
        idNum: Number,
        text: String,
        remindDate: Date,
    }],
    
})

module.exports = new Mongoose.model("Guild", guildSchema, "guilds")