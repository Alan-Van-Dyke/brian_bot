

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (interaction.isChatInputCommand()) {
            const commands = client.commands
            const commandName = interaction.commandName
            const command = commands.get(commandName)
            if (!command) return

            try {
                await command.execute(interaction, client)
            } catch (e) {
                console.error(e)
            }
        }
    }
}