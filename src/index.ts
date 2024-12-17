import * as Discord from "discord.js";
import * as dotenv from "dotenv";
import { slashRegister } from "./slashRegistry";
dotenv.config();

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
            interaction.channel.send("Code for this bot can be found here: https://github.com/rmedcraft/Kitchen-Guy\n\nFind the rest of my projects at https://github.com/rmedcraft");
        }
    }
});

client.login(process.env.TOKEN);