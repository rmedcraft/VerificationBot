import * as Discord from "discord.js";
import * as nodemailer from "nodemailer";


export function sendVerifyModal(interaction) {
    const modal = new Discord.ModalBuilder()
        .setCustomId("verifyModal")
        .setTitle("Verify!");

    const firstNameInput = new Discord.TextInputBuilder()
        .setCustomId('firstNameInput')
        .setLabel("First Name: ")
        .setPlaceholder("John")
        .setRequired(true)
        .setStyle(Discord.TextInputStyle.Short);

    const lastNameInput = new Discord.TextInputBuilder()
        .setCustomId('lastNameInput')
        .setLabel("Last Name: ")
        .setPlaceholder("Doe")
        .setRequired(true)
        .setStyle(Discord.TextInputStyle.Short);

    const emailInput = new Discord.TextInputBuilder()
        .setCustomId("emailInput")
        .setLabel("ESU Email")
        .setPlaceholder("jdoe@live.esu.edu")
        .setRequired(true)
        .setStyle(Discord.TextInputStyle.Short);

    const firstRow = new Discord.ActionRowBuilder<Discord.TextInputBuilder>().addComponents(firstNameInput);
    const secondRow = new Discord.ActionRowBuilder<Discord.TextInputBuilder>().addComponents(lastNameInput);
    const thirdRow = new Discord.ActionRowBuilder<Discord.TextInputBuilder>().addComponents(emailInput);

    modal.addComponents(firstRow, secondRow, thirdRow);

    interaction.showModal(modal);
}

export function modalSubmit(interaction) {
    console.log(interaction);

    const firstName = interaction.fields.getTextInputValue("firstNameInput");
    const lastName = interaction.fields.getTextInputValue("lastNameInput");
    const email = interaction.fields.getTextInputValue("emailInput");

    console.log(firstName, lastName, email);

    interaction.reply({
        content: "Your submission has been received!",
        ephemeral: true
    });

    // check the email is a valid esu email. If it is, then send an email to the recipient
    // create another modal asking for the verification code sent to their email, if it matches the generated code, give them the verified role
}

/**
 * Generates a random 6 digit number
 * @returns a randomized 6 digit number as a string
 */
function generateCode(): string {
    let random: string = Math.floor(Math.random() * 1000000) + "";
    return random.padStart(6, "0");
}

async function sendEmail(to: string, code: string, name: string) {
    // TODO: figure out nodemailer
}