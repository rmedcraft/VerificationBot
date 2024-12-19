import * as Discord from "discord.js";
import * as nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_PASS
    },
});

let code = "";

export function sendVerifyModal(interaction: Discord.ButtonInteraction) {
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

export async function modalSubmit(interaction: Discord.ModalSubmitInteraction) {
    console.log(interaction);

    const firstName: string = interaction.fields.getTextInputValue("firstNameInput");
    const lastName: string = interaction.fields.getTextInputValue("lastNameInput");
    const email: string = interaction.fields.getTextInputValue("emailInput");

    console.log(firstName, lastName, email);

    // await interaction.deferReply({
    //     ephemeral: true
    // });

    code = generateCode();

    await sendEmail(email, code, firstName.charAt(0).toUpperCase() + firstName.substring(1), interaction.guild.name);

    // create an ephemeral message with a button to open the second modal. 

    const codeButton = new Discord.ButtonBuilder()
        .setCustomId("codeButton")
        .setLabel("Enter Code!")
        .setStyle(Discord.ButtonStyle.Success);


    let embed: Discord.EmbedBuilder = new Discord.EmbedBuilder()
        .setColor(0x00FF00)
        .setTitle(`${firstName}, Your email has been sucessfully submitted!`)
        .setDescription(`Check your ESU email for an email from **${process.env.GMAIL_EMAIL}**\n\nIf you didnt get anything, check your spam/junk folder\n\n`);

    const row = new Discord.ActionRowBuilder<Discord.ButtonBuilder>()
        .addComponents(codeButton);

    interaction.reply({
        embeds: [embed],
        components: [row],
        ephemeral: true,
    });
}

export function codeButtonSubmit(interaction: Discord.ButtonInteraction) {
    const modal = new Discord.ModalBuilder()
        .setCustomId("codeModal")
        .setTitle(`Code Submission`);

    const firstNameInput = new Discord.TextInputBuilder()
        .setCustomId('codeInput')
        .setLabel("Verification Code: ")
        .setPlaceholder("123456")
        .setRequired(true)
        .setStyle(Discord.TextInputStyle.Short);

    const firstRow = new Discord.ActionRowBuilder<Discord.TextInputBuilder>().addComponents(firstNameInput);

    modal.addComponents(firstRow);

    interaction.showModal(modal);
}

export function codeModalSubmit(interaction: Discord.ModalSubmitInteraction) {
    const codeInput: string = interaction.fields.getTextInputValue("codeInput");
    if (codeInput === code) {
        interaction.reply({
            content: "You have been sucessfully verified!",
            ephemeral: true
        });
    } else {
        interaction.reply({
            content: "Error: The code you submitted didnt match the one in your inbox",
            ephemeral: true
        });
    }
}

/**
 * Generates a random 6 digit number
 * @returns a randomized 6 digit number as a string
 */
function generateCode(): string {
    let random: string = Math.floor(Math.random() * 1000000) + "";
    return random.padStart(6, "0");
}

/**
 * Sends an email from process.env.GMAIL_EMAIL
 * @param to The email the verification email gets sent to
 * @param code The 6 digit verification code
 * @param name The name of the person being verified
 * @param serverName The name of the server
 */
async function sendEmail(to: string, code: string, name: string, serverName: string) {
    try {
        const body = `
            <p>Hello ${name},</p>
            <p>Your ${serverName} verification code is <strong>${code}</strong>.</p>
            <p>This code will expire in 10 minutes. If you didn’t request this code, please ignore this email.</p>
        `;

        const mailOptions = {
            from: process.env.GMAIL_EMAIL,
            to,
            subject: `Your ${serverName} Verification Code`,
            html: body
        };

        const info = await transporter.sendMail(mailOptions);

        console.log("Email sent:", info.response);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}