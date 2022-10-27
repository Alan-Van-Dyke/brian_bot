const Discord = require('discord.js')
const Guild = require("../../schemas/guild");
const Mongoose = require("mongoose");

//TODO - Currently just removes all items for testing purposed. 

module.exports = {
    data: new Discord.SlashCommandBuilder().setName('removetodo').setDescription('Remove an item from the current todo list'),
    async execute(interaction, client) {
        guildProfile = await Guild.findOne({ guildId: interaction.guild.id });
        if (!guildProfile) {
            guildProfile = await new Guild({
                _id: Mongoose.Types.ObjectId(),
                guildId: interaction.guild.id,
                guildName: interaction.guild.name,
                todoItems: [],
            });
        }

        guildProfile.todoItems = []

        await guildProfile.save().catch(console.error);
    },
}