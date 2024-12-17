import * as dotenv from "dotenv";
dotenv.config();

// const { Routes } = require("discord-api-types/v10");
import { Routes } from "discord-api-types/v10";


// const { REST } = require("@discordjs/rest");
import { REST } from "@discordjs/rest";
// const { SlashCommandBuilder } = require("@discordjs/builders");
import { SlashCommandBuilder } from "@discordjs/builders";


const botID = "1306344304926785748"; // KITCHEN GUY ID
const botToken = process.env.TOKEN;

const rest = new REST().setToken(botToken);
export const slashRegister = async (serverID) => {
    try {
        await rest.put(Routes.applicationGuildCommands(botID, serverID), {
            body: [
                new SlashCommandBuilder().setName("github").setDescription("Look at the code for this bot"),
                
            ],
        });
    } catch (error) {
        console.error(error);
    }
};