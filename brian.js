const Discord = require('discord.js');
const Mongoose = require('mongoose')
const fs = require('fs');

require('dotenv').config();

//TUTORIAL LINK https://www.youtube.com/watch?v=6IgOXmQMT68

const token = process.env.token;
const dbtoken = process.env.dbtoken

const client = new Discord.Client({
    intents: Discord.GatewayIntentBits.Guilds
});

client.commands = new Discord.Collection();
client.commandArray = [];

const funcFolders = fs.readdirSync('./functions');
for (const folder of funcFolders) {
    const funcFiles = fs.readdirSync(`./functions/${folder}`).filter((f) => f.endsWith('.js'));

    for (const file of funcFiles) {
        require(`./functions/${folder}/${file}`)(client);
    }
}

client.handleEvents();
client.handleCommands();

client.login(token).then(() => {
    client.user.setActivity('BrianBot')
});

(async () => {
    await Mongoose.connect(dbtoken).catch(console.error)
})()