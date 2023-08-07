const { SlashCommandBuilder } = require('discord.js');
const Util = require('../utils/Util');

const cmds = Util.getCommandNames();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('settings')
		.setDescription('Configure the bot\'s setting')
		.setDMPermission(false)

	// Command Permission settings ( /settings command-permission set )
		.addSubcommandGroup(group =>
			group.setName('command-permission')
				.setDescription('Configure the permissions of the different commands')

			// Add permission
				.addSubcommand(sub =>
					sub.setName('set')
						.setDescription('Set the individual role/user permissions for a command.')
						.addStringOption(opt =>
							opt.setName('command')
								.setDescription('The command to set the permissions')
								.setRequired(true)
								.setChoices(...cmds.map(cmd => {
									return { name: cmd, value: cmd };
								})),
						),
				),
		),
	async execute(interaction) {
        
	},
};
// Util.getCommands().map(cmd => cmd.name)