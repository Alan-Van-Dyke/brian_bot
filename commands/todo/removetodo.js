const Discord = require('discord.js')
const Guild = require("../../schemas/guild");
const Mongoose = require("mongoose");

//TODO - Currently just removes all items for testing purposed. 

module.exports = {
    data: new Discord.SlashCommandBuilder().setName('removetodo').setDescription('Remove an item from the current todo list')
            .addNumberOption((option) => option.setName('id').setDescription('The ID of the object to be removed').setRequired(true)),
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

        todos = guildProfile.todoItems
        console.log("LOOK UNDER HERE")
        console.log(todos[0])

        // [0, 1, 2, 3]
        idToRemove = interaction.options.getNumber('id')

        updated_todos = todos.filter(item => item.idNum !== idToRemove)
        console.log(updated_todos)
        

        guildProfile.todoItems = updated_todos

        await guildProfile.save().catch(console.error);

        await interaction.reply({
            content: "Removed!"
        })
    },
}