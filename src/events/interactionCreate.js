const { Events, PermissionFlagsBits } = require('discord.js');
const Console = require('../utils/BotConsole');
const Util = require('../utils/Util');

module.exports = {
	name: Events.InteractionCreate,
	/**
	 *
	 * @param {import('discord.js').Interaction} interaction
	 * @returns
	 */
	async execute(interaction) {
		/**
     	 * @type {import('../modules/CommandPermissionManager')}
     	 */
		const commandPermissionManager = interaction.client.commandPermissionManager;

		/**
		 * @type {import('../modules/SettingsManager')}
		 */
		const settingsManager = interaction.client.settingsManager;

		if (!interaction.isChatInputCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			Console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		if (commandPermissionManager.hasPermission(interaction.guild.id, interaction.commandName, interaction.member) === false && (interaction.memberPermissions.has(PermissionFlagsBits.Administrator, true) === false || settingsManager.get(interaction.guild.id).allowAdminBypass === false)) {
			return await interaction.reply({
				embeds: [Util.errorEmbed('You do not have permission to run this command.')],
			});
		}

		try {
			Console.log(`Running /${interaction.commandName}`);
			await command.execute(interaction);
		}
		catch (error) {
			Console.error(`Error executing ${interaction.commandName}`);
			console.error(error);
		}
	},
};