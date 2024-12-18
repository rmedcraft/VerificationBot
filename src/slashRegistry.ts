import * as dotenv from "dotenv";
dotenv.config();

// const { Routes } = require("discord-api-types/v10");
import { Routes } from "discord-api-types/v10";


// const { REST } = require("@discordjs/rest");
import { REST } from "@discordjs/rest";
// const { SlashCommandBuilder } = require("@discordjs/builders");
import { SlashCommandBuilder } from "@discordjs/builders";


const botID = "1318379358754308096";
const botToken = process.env.TOKEN;

const rest = new REST().setToken(botToken);
export const slashRegister = async (serverID) => {
    try {
        await rest.put(Routes.applicationGuildCommands(botID, serverID), {
            body: [
                new SlashCommandBuilder().setName("ping").setDescription("test command"),
                new SlashCommandBuilder().setName("github").setDescription("Look at the code for this bot"),
                new SlashCommandBuilder()
                    .setName("config")
                    .setDescription("Set the configs for your server")
                    .addSubcommand((subcommand) => subcommand
                        .setName("setlanding")
                        .setDescription("Set the channel to verify people in")
                        .addChannelOption((option) =>
                            option.setName("channel")
                                .setDescription("The landing channel, where people are verified")
                                .setRequired(true)
                        )
                    )
                    .addSubcommand((subcommand) => subcommand
                        .setName("role")
                        .setDescription("Set the role people are given once verified")
                        .addRoleOption((option) =>
                            option.setName("verified")
                                .setDescription("The role verified users are given")
                                .setRequired(true)
                        )
                    ),
            ],
        });
    } catch (error) {
        console.error(error);
    }
};