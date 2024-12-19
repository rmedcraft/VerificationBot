import * as Discord from "discord.js";
import * as nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_PASS
    },
});

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

    const firstName: string = interaction.fields.getTextInputValue("firstNameInput");
    const lastName: string = interaction.fields.getTextInputValue("lastNameInput");
    const email: string = interaction.fields.getTextInputValue("emailInput");

    console.log(firstName, lastName, email);

    interaction.reply({
        content: "Your submission has been received!",
        ephemeral: true
    });

    // check the email is a valid esu email. If it is, then send an email to the recipient
    // create another modal asking for the verification code sent to their email, if it matches the generated code, give them the verified role
    const code = generateCode();

    sendEmail(email, code, firstName.charAt(0).toUpperCase() + firstName.substring(1));

    // create another modal to input the verification code
    const modal = new Discord.ModalBuilder()
        .setCustomId("codeModal")
        .setTitle(`A code was sent to ${email} from ${process.env.GMAIL_EMAIL}`);

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

    try {
        const body = `
            <p>Hello ${name},</p>
            <p>Your Discord verification code is <strong>${code}</strong>.</p>
            <p>This code will expire in 10 minutes. If you didn’t request this code, please ignore this email.</p>
        `;

        const mailOptions = {
            from: process.env.GMAIL_EMAIL,
            to,
            subject: "Your Discord Verification Code",
            html: body
        };

        const info = await transporter.sendMail(mailOptions);

        console.log("Email sent:", info.response);
    } catch (error) {
        console.error('Error sending emial:', error);
    }

}