const { Events } = require('discord.js');
const Console = require('../utils/BotConsole');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (!interaction.isChatInputCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			Console.error(`No command matching ${interaction.commandName} was found.`);
			return;
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