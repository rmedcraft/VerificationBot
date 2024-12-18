import * as Discord from "discord.js";
import * as dotenv from "dotenv";
import { slashRegister } from "./slashRegistry";
import { modalSubmit, sendVerifyModal } from "./verify";
dotenv.config();

/* 
    turns on all bot permissions. If you're having unexplainable issues, 
    uncomment this and comment out the other client declaration
    If it fixes the problem, 
*/
// const client = new Discord.Client({
//     intents: Object.keys(Discord.GatewayIntentBits).map((a) => {
//         return Discord.GatewayIntentBits[a];
//     })
// });

const client = new Discord.Client({
    intents: ["Guilds", "GuildMessages", "GuildMessageReactions", "DirectMessageReactions"]
});

client.on("ready", () => {
    console.log("Bot is ready :O");
});

// registers the slash commands individually for each server the bot joins.
// its possible to register the commands without the serverID, but that takes an hour to go through and I no wanna during testing
client.on("guildCreate", (guild) => {
    slashRegister(guild.id);
});

// bot code here!
client.on("interactionCreate", async (interaction) => {
    if (interaction.isCommand() && interaction.isChatInputCommand()) {
        // check commands  
        if (interaction.commandName === "github") {
            interaction.reply("Code for this bot can be found here: https://github.com/rmedcraft/VerificationBot\n\nFind the rest of my projects at https://github.com/rmedcraft");
        }
        if (interaction.commandName === "ping") {
            const verify = new Discord.ButtonBuilder()
                .setCustomId("verifyButton")
                .setLabel("Verify!")
                .setStyle(Discord.ButtonStyle.Success);

            const row = new Discord.ActionRowBuilder<Discord.ButtonBuilder>()
                .addComponents(verify);

            let embed: Discord.EmbedBuilder = new Discord.EmbedBuilder()
                .setColor(0x00FF00)
                .setTitle("Click here to verify your account!");

            interaction.reply({
                embeds: [embed],
                components: [row]
            });
        }
    } else if (interaction.isButton()) {
        if (interaction.customId == "verifyButton") {
            sendVerifyModal(interaction);
        }
    } else if (interaction.isModalSubmit()) {
        if (interaction.customId === "verifyModal") {
            modalSubmit(interaction);
        }
    }
});

client.login(process.env.TOKEN);