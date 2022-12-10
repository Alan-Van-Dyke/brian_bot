const Discord = require('discord.js');
const Guild = require("../../schemas/guild");
const schedule = require("node-schedule")
const Mongoose = require("mongoose");

module.exports = {
    data: new Discord.SlashCommandBuilder().setName('addtodo').setDescription('Add an item to the current todo list')
        .addStringOption((option) => option.setName('text').setDescription('The content of the item').setRequired(true))
        .addNumberOption((option) => option.setName('month').setDescription('The month you want to be reminded.').setRequired(true))
        .addNumberOption((option) => option.setName('day').setDescription('The day you want to be reminded.').setRequired(true))
        .addNumberOption((option) => option.setName('year').setDescription('The year you want to be reminded.').setRequired(true))
        .addNumberOption((option) => option.setName('hour').setDescription('The time you want the be reminded (24H).').setRequired(true))
        .addNumberOption((option) => option.setName('minute').setDescription('The time you want to be reminded (24H).').setRequired(true)),
    
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
        
        const itemDate = new Date(interaction.options.getNumber('year'),
                                    interaction.options.getNumber('month')-1,
                                    interaction.options.getNumber('day'),
                                    interaction.options.getNumber('hour'),
                                    interaction.options.getNumber('minute'),
                                    0,0)

        

        try {
            //Add to Mongo
            guildProfile.todoItems.push({
                text: interaction.options.getString('text'),
                remindDate: itemDate
            })

            //pull the added item for scheduling
            new_length = guildProfile.todoItems.length
            added_item = guildProfile.todoItems[new_length-1]

            //start the cron job to DM a reminder
            //the first parameter is the name, always in the format
            //remind_*mongo id*
            //used for cancelling on remove
            var remindJob = new schedule.scheduleJob(
                "remind_" + added_item["_id"].toString(),
                itemDate,
                function(){
                    reminderMessage = "Reminder: " + interaction.options.getString('text')
                    interaction.user.send(reminderMessage)

                    guildProfile.todoItems = guildProfile.todoItems.filter((item, index) => index !== new_length-1)
                    guildProfile.save()
                }
            )

        } catch (e) {
            console.error(e)
        } finally {
            await guildProfile.save().catch(console.error);

            await interaction.reply({
                content: "Added! I'll remind you to \"" + interaction.options.getString('text') + "\" at " + itemDate
            })
        }
    }
}