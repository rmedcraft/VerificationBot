import * as Discord from "discord.js";
import * as dotenv from "dotenv";
import { slashRegister } from "./slashRegistry";
import { codeButtonSubmit, codeModalSubmit, modalSubmit, sendVerifyModal } from "./verify";
import connectToDatabase from "./mongo";
import { ServerOpeningEvent } from "mongodb";

dotenv.config();

/* 
    turns on all bot permissions. If you're having unexplainable issues, 
    uncomment this and comment out the other client declaration
    If it fixes the problem, find the missing permission. Dont just leave this uncommented
*/
// const client = new Discord.Client({
//     intents: Object.keys(Discord.GatewayIntentBits).map((a) => {
//         return Discord.GatewayIntentBits[a];
//     })
// });

const client = new Discord.Client({
    intents: ["Guilds", "GuildMessages", "GuildMessageReactions", "DirectMessageReactions"]
});



// runs when the bot is started
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
                .setTitle("Click here to verify your account!")
                .setFooter({
                    text: "If you are not a current ESU student, but still believe you should be let in the server, please contact the server moderation"
                });

            interaction.reply({
                embeds: [embed],
                components: [row]
            });
        }

        // all of the server moderation's config options
        if (interaction.commandName === "config") {
            // gets the mongoDB database & the subcommand
            await interaction.deferReply();

            const db = await connectToDatabase();
            const collection = db.collection("servers");
            const subcommand = interaction.options.getSubcommand();

            let serverInfo = await collection.findOne({ serverID: interaction.guild.id });
            // verifies the server info exists
            if (!serverInfo) {
                collection.insertOne({ serverID: interaction.guild.id });
                serverInfo = await collection.findOne({ serverID: interaction.guild.id });
            }
            // each of the subcommands
            if (subcommand === "setverifiedrole") {
                const verifyRole = interaction.options.getRole("verified");

                collection.updateOne({ serverID: interaction.guild.id }, { $set: { verifiedRole: verifyRole.id } });

                const embed = new Discord.EmbedBuilder()
                    .setTitle(`Success!`)
                    .setDescription(`Verified role changed to ${verifyRole.name}`)
                    .setColor(0xFF0000);
                interaction.editReply({
                    embeds: [embed]
                });
            }
            if (subcommand === "setlanding") {
                // you need a verified role in order to let people verify themselves
                if (!serverInfo.verifiedRole) {
                    let embed = new Discord.EmbedBuilder()
                        .setColor(0xFF0000)
                        .setTitle("Error: ")
                        .setDescription("You need to set a verified role with `/config setverifiedrole` in order to use this command");
                    interaction.editReply({
                        embeds: [embed],
                    });
                    return;
                }

                const landing = interaction.options.getChannel("channel");
                if (!(landing instanceof Discord.TextChannel)) return; // will likely never return, but just to be safe

                // if the landing channel already exists, look at the verifymessage part of the database, delete that message.
                // this forces only one verification message at once. 
                if (serverInfo.landing) {
                    const channel = await client.channels.fetch(serverInfo.landing);
                    if (!channel.isTextBased()) return;
                    const message = await channel.messages.fetch(serverInfo.verifyMessage);
                    message.delete();
                }

                // create a new verification message in the new channel & update the database
                const verify = new Discord.ButtonBuilder()
                    .setCustomId("verifyButton")
                    .setLabel("Verify!")
                    .setStyle(Discord.ButtonStyle.Success);

                const row = new Discord.ActionRowBuilder<Discord.ButtonBuilder>()
                    .addComponents(verify);

                let verifyEmbed: Discord.EmbedBuilder = new Discord.EmbedBuilder()
                    .setColor(0x00FF00)
                    .setTitle("Click here to verify your account!")
                    .setFooter({
                        text: "If you are not a current ESU student, but still believe you should be let in the server, please contact the server moderation"
                    });

                const verifyMessage = await landing.send({
                    embeds: [verifyEmbed],
                    components: [row]
                });

                // update the database
                collection.updateOne({ serverID: interaction.guild.id }, { $set: { landing: landing.id, verifyMessage: verifyMessage.id } });

                // send confirmation message
                const embed = new Discord.EmbedBuilder()
                    .setTitle(`Success!`)
                    .setDescription(`Landing channel changed to ${landing.name}`)
                    .setColor(0xFF0000);
                interaction.editReply({
                    embeds: [embed]
                });
            }
        }
    } else if (interaction.isButton()) {
        if (interaction.customId === "verifyButton") {
            sendVerifyModal(interaction);
        }
        if (interaction.customId === "codeButton") {
            codeButtonSubmit(interaction);
        }
    } else if (interaction.isModalSubmit()) {
        if (interaction.customId === "verifyModal") {
            modalSubmit(interaction);
        }
        if (interaction.customId === "codeModal") {
            codeModalSubmit(interaction);
        }
    }
});

client.login(process.env.TOKEN);