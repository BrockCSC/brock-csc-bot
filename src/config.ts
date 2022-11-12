const loadEnvKey = function(key: string) {
	const result = process.env[key];

	if (typeof result !== "string") {
		throw new Error(`The ${key} enviornment variable is not defined.`)
	}

	return result;
}

export const MFA_TOKENS = new Map([
	["google", loadEnvKey("GOOGLE_MFA_TOKEN")],
	["bitwarden", loadEnvKey("BITWARDEN_MFA_TOKEN")],
]);

export const DISCORD_CLIENT_ID = loadEnvKey("DISCORD_CLIENT_ID");
export const DISCORD_BOT_TOKEN = loadEnvKey("DISCORD_BOT_TOKEN");
export const CSC_GUILD_ID = loadEnvKey("CSC_GUILD_ID");
export const EXEC_ROLE_ID = loadEnvKey("EXEC_ROLE_ID");
