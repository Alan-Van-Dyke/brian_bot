const Discord = require("discord.js");
const Guild = require("../../schemas/guild");
const Mongoose = require("mongoose");

module.exports = {
    data: new Discord.SlashCommandBuilder().setName("showtodo").setDescription("Show the current todo list"),
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

        await guildProfile.save().catch(console.error);

        await interaction.reply({
            content: "List" + guildProfile.todoItems
        })
    },
};
