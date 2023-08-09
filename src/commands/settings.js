const { SlashCommandBuilder, ChatInputCommandInteraction, PermissionFlagsBits } = require('discord.js');
const Util = require('../utils/Util');

const cmds = Util.getCommandNames();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('settings')
		.setDescription('Configure the bot\'s setting')
		.setDMPermission(false)
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
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
							}))
						)
						.addMentionableOption(opt =>
							opt.setName('user-or-role')
							.setDescription('The user or role to set the permisions for.')
							.setRequired(true)
						)
						.addBooleanOption(opt => 
							opt.setName('permission')
							.setDescription('Wether the role or user have permission to use the command.')
							.setRequired(true)
						),
				),
		),
	/**
	 * 
	 * @param {ChatInputCommandInteraction} interaction 
	 */
	async execute(interaction) {
		const commandPermissionGroup = require('./settings/command-permission');
        const group = interaction.options.getSubcommandGroup();
		const subcmd = interaction.options.getSubcommand();

		await interaction.deferReply();

		switch(group) {
			case 'command-permission':
				if (subcmd === 'set') {
					await commandPermissionGroup.set(interaction)
				}
				break;
		}
	},
};
// Util.getCommands().map(cmd => cmd.name)