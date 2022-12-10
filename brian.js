const Discord = require('discord.js');
const Mongoose = require('mongoose')
const fs = require('fs');
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");

require('dotenv').config();

const token = process.env.token;
const dbtoken = process.env.dbtoken

const client = new Discord.Client({
    intents: Discord.GatewayIntentBits.Guilds
});

client.commands = new Discord.Collection();
client.commandArray = [];

//require all functions defined in the functions directory
const funcFolders = fs.readdirSync('./functions');
for (const folder of funcFolders) {
    const funcFiles = fs.readdirSync(`./functions/${folder}`).filter((f) => f.endsWith('.js'));

    for (const file of funcFiles) {
        require(`./functions/${folder}/${file}`)(client);
    }
}

//set event callback functions to those defined in /events
client.handleEvents();

client.login(token).then(() => {
    client.user.setActivity('BrianBot')
});

(async () => {
    await Mongoose.connect(dbtoken).catch(console.error)
})()

//register all commands and push them to all servers in mongo
client.handleCommands();

var guildIdList = []

//define the listener for ready here instead of in handleEvents because we need to get the list of active guilds
client.once('ready', () => {
    guildIdList = client.guilds.cache.map(guild => guild.id)
    console.log("BrianBot is running!")

    //constant client ID for the discord bot
    const clientId = "1015423459666448385";

    const rest = new REST({ version: "9" }).setToken(process.env.token);
    try {
        guildIdList.forEach((guildId) => {
            rest.put(Routes.applicationGuildCommands(clientId, guildId), {
                body: client.commandArray,
            });
        });
    } catch (e) {
        console.error(e);
    }

})

