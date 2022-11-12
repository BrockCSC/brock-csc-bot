import authenticator from "authenticator";
import { ChatInputCommandInteraction, GuildMember } from "discord.js";

import { EXEC_ROLE_ID, MFA_TOKENS } from "../config"

export const authCommand = async function(interaction: ChatInputCommandInteraction) {
	const { member } = interaction;

	if (!(member instanceof GuildMember) || !member.roles.cache.has(EXEC_ROLE_ID)) {
		await interaction.reply({ content: "nope", ephemeral: true });
	}

	const service = interaction.options.getString("service");
	const token = service && MFA_TOKENS.get(service);

	if (!token) {
		await interaction.reply({
			content: `You need to provide a valid service name (e.g. \`/auth ${MFA_TOKENS.keys().next().value}\`).`,
			ephemeral: true
		});

		return;
	}

	const code = authenticator.generateToken(token);
	await interaction.reply({ content: `Your verification code is \`${code}\`.`, ephemeral: true });
}
