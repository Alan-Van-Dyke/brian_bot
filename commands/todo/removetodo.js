const Discord = require('discord.js')
const Guild = require("../../schemas/guild");
const schedule = require('node-schedule')
const Mongoose = require("mongoose");

module.exports = {
    data: new Discord.SlashCommandBuilder().setName('removetodo').setDescription('Remove an item from the current todo list')
            .addNumberOption((option) => option.setName('id').setDescription('The ID of the object to be removed').setRequired(true)),
    async execute(interaction, client) {
        //Get the profile, or create a new one if nothing exists
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
        
        //Find the item we're removing. save it's ID so we can cancel the cron job
        idToRemove = interaction.options.getNumber('id')
        item_to_remove = guildProfile.todoItems[idToRemove]
        removed_id = item_to_remove["_id"].toString()

        //pull out the removed todo item by index. Update the list in Mongo
        updated_todos = todos.filter((item, index) => index !== idToRemove)

        guildProfile.todoItems = updated_todos

        await guildProfile.save().catch(console.error);

        //cancel the cron job with the ID saved earlier
        job_to_cancel = schedule.scheduledJobs["remind_"+removed_id]
        //If there is no job, we still want to remove the list item without throwing an error
        //This happens when the bot is reset - all cron jobs are deleted, but the list items persist
        if(job_to_cancel) { 
            job_to_cancel.cancel()
        }

        await interaction.reply({
            content: "Removed!"
        })
    },
}