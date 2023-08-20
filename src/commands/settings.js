const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const Util = require('../utils/Util');

const cmds = Util.getCommandNames();

module.exports = {
	data: new SlashCommandBuilder()
		.setName('settings')
		.setDescription('Configure the bot\'s setting')
		.setDMPermission(false)
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
		.addSubcommand(subcmd =>
			subcmd.setName('allow-higher-roles-moderation')
				.setDescription('Wether a user can moderate another user with higher or equal roles')
				.addBooleanOption(opt =>
					opt.setName('value')
						.setDescription('Wether a user can moderate another user with higher or equal roles')
						.setRequired(true),
				),
		)
		.addSubcommand(subcmd =>
			subcmd.setName('allow-admin-moderation')
				.setDescription('Wether a user can moderate another user with the `Administrator` permission')
				.addBooleanOption(opt =>
					opt.setName('value')
						.setDescription('Wether a user can moderate another user with the `Administrator` permission')
						.setRequired(true),
				),
		)
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
					cmd.setName('allow-admin-bypass')
						.setDescription('Wether users with the Administrator permission can bypass role/user permisisons')
						.addBooleanOption(opt => opt.setName('value').setRequired(true).setDescription('Wether users with the Administrator permission can bypass role/user permisisons')),
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
			switch (subcmd) {
			case ('add'):
				await commandPermissionGroup.add(interaction);
				break;
			case ('remove'):
				await commandPermissionGroup.remove(interaction);
				break;
			case ('clear'):
				await commandPermissionGroup.clear(interaction);
				break;
			case ('allow-admin-bypass'):
				await commandPermissionGroup.allowAdminBypass(interaction);
				break;
			}
			break;
		case (null):
			await exports.updateBooleanSetting(Util.settingsNameConverter(subcmd), interaction);
			break;
		}
	},
};

/**
 *
 * @param {string} settingName
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 */
exports.updateBooleanSetting = async (settingName, interaction) => {

	const booleanSettingDescription = {
		allowHigherRolesModeration: 'users to moderate another user with a higher or equal role.',
		allowAdminModeration: 'users to moderate another user with the `Administrator` permission',
	};


	const value = interaction.options.getBoolean('value');
	/**
	 * @type {import('../modules/SettingsManager.js')}
	 */
	const settingsManager = interaction.client.settingsManager;
	settingsManager.update(interaction.guild.id, { allowHigherRolesModeration: value });
	return await interaction.editReply({
		embeds: [Util.successEmbed(`**${value ? 'Allowed' : 'Disallowed'}** ${booleanSettingDescription[settingName]}`)],
	});
};