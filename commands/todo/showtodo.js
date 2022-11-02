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

        const embed = new Discord.EmbedBuilder()
            .setColor(0x00FF00)
            .setTitle(guildProfile.guildName + " Todo List")
            .setFields({name: "ID", value: "\u200b", inline: true},
                       {name: "Content", value: "\u200b", inline: true},
                       {name: "Date", value: "\u200b", inline:true})
        
        guildProfile.todoItems.forEach((item) => {
            const dateString = item.remindDate.getMonth() + "/" + item.remindDate.getDay() + " at " + item.remindDate.getHours() + ":" + item.remindDate.getMinutes()

            console.log(item.idNum)
            embed.addFields({name: "\u200b", value: item.idNum + "", inline:true},
                            {name: "\u200b", value: item.text, inline:true},
                            {name: "\u200b", value: dateString, inline:true})
        })

        console.log(interaction.channel.send({embeds: [embed]}))

        await interaction.reply({
            content: "done!"
        })
    },
};
