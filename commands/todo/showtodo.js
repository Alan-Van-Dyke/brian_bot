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

        var reply = ""

        var embedIdVal = "\n";
        var embedContentVal = "\n";
        var embedDateVal = "\n";


        if(guildProfile.todoItems.length > 0){

            guildProfile.todoItems.forEach((item, index) => {
                var dateString = item.remindDate.toLocaleString('en-us', {weekday: 'long'}) + " " + item.remindDate.toLocaleString('en-us')
                var contentString;
                if(item.text.length > 25){
                    contentString = item.text.substring(0,20) + "..."
                } else {
                    contentString = item.text
                }
                

                embedIdVal = embedIdVal + index + "\n";
                embedContentVal = embedContentVal + contentString + "\n";
                embedDateVal = embedDateVal + dateString + "\n";
                
            })
        

            const embed = new Discord.EmbedBuilder()
                .setColor(0x00FF00)
                .setTitle(guildProfile.guildName + " Todo List")
                .setFields({name: "ID", value: embedIdVal, inline: true},
                        {name: "Content", value: embedContentVal, inline: true},
                        {name: "Date", value: embedDateVal, inline:true})

            interaction.channel.send({embeds: [embed]})

            reply = "done!"
        } else {
            reply = "No todo items found"
        }

        await interaction.reply({
            content: reply
        })
    },
};
