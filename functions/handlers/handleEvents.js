const fs = require('fs');
const Mongoose = require('mongoose')

module.exports = (client) => {
    client.handleEvents = async () => {
        const eventFolders = fs.readdirSync('./events');

        for (const folder of eventFolders) {
            const eventFiles = fs.readdirSync(`./events/${folder}`).filter((file) => file.endsWith('.js'));

            if (folder == "client") {
                for (const file of eventFiles) {
                    const event = require(`../../events/${folder}/${file}`);
                    if (event.once) {
                        client.once(event.name, (...args) => event.execute(...args, client));
                    } else {
                        client.on(event.name, (...args) => event.execute(...args, client));
                    }
                }
            } else if (folder == "mongo") {
                for (const file of eventFiles) {
                    const event = require(`../../events/${folder}/${file}`)
                    if (event.once) {
                        Mongoose.connection.once(event.name, (...args) => event.execute(...args, client))
                    } else {
                        Mongoose.connection.on(event.name, (...args) => event.execute(...args, client))
                    }
                }
            }
        }
    }
}