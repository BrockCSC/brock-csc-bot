import "dotenv/config"

import authenticator from "authenticator";
import { Client, GuildMember, Intents } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import { REST } from "@discordjs/rest";
import { Routes } from "discord-api-types/v9";

import { MFA_TOKEN, DISCORD_BOT_TOKEN, DISCORD_CLIENT_ID, CSC_GUILD_ID, EXEC_ROLE_ID } from "./config"

const rest = new REST({ version: "9" }).setToken(DISCORD_BOT_TOKEN);

const setUpCommands = async function () {
	// TODO: handle `default_permission` deprecation
	await rest.put(Routes.applicationGuildCommands(DISCORD_CLIENT_ID, CSC_GUILD_ID), {
		body: [
			new SlashCommandBuilder()
				.setName("auth")
				.setDescription("Gives you a six-digit MFA code.")
				.setDefaultPermission(false)
		]
	}) as [{ id: string }];
}

const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
});

client.on("interactionCreate", async interaction => {
	if (!interaction.isCommand()) { return; }

	if (interaction.commandName === "auth") {
		const { member } = interaction;

		if (!(member instanceof GuildMember) || !member.roles.cache.has(EXEC_ROLE_ID)) {
			await interaction.reply({ content: "nope", ephemeral: true });
		}

		const token = authenticator.generateToken(MFA_TOKEN);
		await interaction.reply({ content: `Your verification code is \`${token}\`.`, ephemeral: true });
	}
});

(async function main() {
	await setUpCommands();
	await client.login(DISCORD_BOT_TOKEN);
})()
