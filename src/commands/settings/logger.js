'use-strict';

const Util = require('../../utils/Util');

/**
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 */
exports.enable = async (interaction) => {
	/**
     * @type {import('../../modules/SettingsManager')}
     */
	const settings = interaction.client.settingsManager;

	settings.update(interaction.guildId, { loggerEnabled: true });

	return await interaction.editReply({
		embeds: [Util.successEmbed('**Enabled** the logging module.')],
	});
};

/**
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 */
exports.disable = async (interaction) => {
	/**
     * @type {import('../../modules/SettingsManager')}
     */
	const settings = interaction.client.settingsManager;

	settings.update(interaction.guildId, { loggerEnabled: false });

	return await interaction.editReply({
		embeds: [Util.successEmbed('**Disabled** the logging module.')],
	});
};

/**
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 */
exports.setLoggingChannel = async (interaction) => {
	const channel = interaction.options.getChannel('channel');

	/**
     * @type {import('../../modules/Logger')}
     */
	const settings = interaction.client.logger;

	settings.update(interaction.guildId, { loggerChannelId: channel.id });

	return await interaction.editReply({
		embeds: [Util.successEmbed(`Set the log channel to ${channel.toString()}.`)],
	});
};