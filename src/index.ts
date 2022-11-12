import "dotenv/config"

import { ChatInputCommandInteraction, Client, GatewayIntentBits, REST, SlashCommandBuilder } from "discord.js";
import { Routes } from "discord-api-types/v9";

import { DISCORD_BOT_TOKEN, DISCORD_CLIENT_ID, CSC_GUILD_ID, MFA_TOKENS } from "./config"
import { authCommand } from "./commands/auth";

const rest = new REST({ version: "10" }).setToken(DISCORD_BOT_TOKEN);

const setUpCommands = async function () {
	// TODO: handle `default_permission` deprecation
	await rest.put(Routes.applicationGuildCommands(DISCORD_CLIENT_ID, CSC_GUILD_ID), {
		body: [
			new SlashCommandBuilder()
				.setName("auth")
				.setDescription("Gives you a six-digit MFA code.")
				.setDefaultMemberPermissions("0")
				.addStringOption(option => option
					.setName("service")
					.setRequired(true)
					.setDescription("The service you need a MFA code for.")
					.addChoices(...[
						...MFA_TOKENS.keys()
					].map(service => ({ name: service, value: service })))
				)
		]
	}) as [{ id: string }];
}

const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
});

client.on("interactionCreate", async interaction => {
	if (!interaction.isCommand()) { return; }

	if (interaction instanceof ChatInputCommandInteraction && interaction.commandName === "auth") {
		authCommand(interaction);
	}
});

(async function main() {
	await setUpCommands();
	await client.login(DISCORD_BOT_TOKEN);
})()
