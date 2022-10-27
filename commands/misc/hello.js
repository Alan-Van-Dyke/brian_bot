const Discord = require('discord.js')

module.exports = {
    data: new Discord.SlashCommandBuilder().setName('hello').setDescription('Say hello'),
    async execute(interaction, client) {
        const message = await interaction.deferReply({
            fetchReply: true
        })

        const newMessage = `Hello!`
        await interaction.editReply({
            content: newMessage
        })
    }
}