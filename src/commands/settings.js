const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const Util = require('../utils/Util');

const cmds = Util.getCommandNames();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('settings')
		.setDescription('Configure the bot\'s setting')
		.setDMPermission(false)
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
		.addSubcommandGroup(group =>
			group.setName('command-permission')
				.setDescription('Configure the permissions of the different commands')
				.addSubcommand(sub =>
					sub.setName('add')
						.setDescription('Add individual role/user permission for a command.')
						.addStringOption(opt =>
							opt.setName('command')
								.setDescription('The command to add the permission')
								.setRequired(true)
								.setChoices(...cmds.map(cmd => {
									return { name: cmd, value: cmd };
								})),
						)
						.addMentionableOption(opt =>
							opt.setName('user-or-role')
								.setDescription('The user or role to add the permision for.')
								.setRequired(true),
						)
						.addBooleanOption(opt =>
							opt.setName('permission')
								.setDescription('Wether the role or user have permission to use the command.')
								.setRequired(true),
						),
				)
				.addSubcommand(sub =>
					sub.setName('remove')
						.setDescription('Remove individual role/user permission for a command.')
						.addStringOption(opt =>
							opt.setName('command')
								.setDescription('The command to remove the permission')
								.setRequired(true)
								.setChoices(...cmds.map(cmd => {
									return { name: cmd, value: cmd };
								})),
						),
				)
				.addSubcommand(sub =>
					sub.setName('clear')
						.setDescription('Clear all role/user permissions of command.')
						.addStringOption(opt =>
							opt.setName('command')
								.setDescription('The command to remove all the permissions')
								.setRequired(true)
								.setChoices(...cmds.map(cmd => {
									return { name: cmd, value: cmd };
								})),
						),
				)
				.addSubcommand(cmd =>
					cmd.setName('allowAdminBypass')
						.setDescription('Wether users with the Administrator permission can bypass role/user permisisons')
						.addBooleanOption(opt => opt.setName('value').setRequired(true)),
				),
		),
	/**
	 *
	 * @param {import('discord.js').ChatInputCommandInteraction} interaction
	 */
	async execute(interaction) {
		const commandPermissionGroup = require('./settings/command-permission');
		const group = interaction.options.getSubcommandGroup();
		const subcmd = interaction.options.getSubcommand();

		await interaction.deferReply();

		switch (group) {
		case 'command-permission':
			if (subcmd === 'add') {
				await commandPermissionGroup.add(interaction);
			}
			else if (subcmd === 'remove') {
				await commandPermissionGroup.remove(interaction);
			}
			else if (subcmd === 'clear') {
				await commandPermissionGroup.clear(interaction);
			}
			else if (subcmd === 'allowAdminBypass') {
				await commandPermissionGroup.allowAdminBypass(interaction);
			}
			break;

		}
	},
};
// Util.getCommands().map(cmd => cmd.name)