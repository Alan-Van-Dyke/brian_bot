const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");

const fs = require("fs");

module.exports = (client) => {
    client.handleCommands = async () => {
        const commandFolders = fs.readdirSync("./commands");

        for (const folder of commandFolders) {
            const commandFiles = fs
                .readdirSync(`./commands/${folder}`)
                .filter((file) => file.endsWith(".js"));

            for (const file of commandFiles) {
                const command = require(`../../commands/${folder}/${file}`);

                client.commands.set(command.data.name, command);
                client.commandArray.push(command.data.toJSON());
                console.log("Registered command " + command.data.name + ".");
            }
        }

        const clientId = "1015423459666448385";
        const guildId = "785363246868725792";
        const rest = new REST({ version: "9" }).setToken(process.env.token);
        try {
            await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
                body: client.commandArray,
            });
        } catch (e) {
            console.error(e);
        }
    };
};
