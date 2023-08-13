const { Role, GuildMember, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, EmbedBuilder, ActionRowBuilder, InteractionCollector } = require('discord.js');
const Util = require('../../utils/Util');
const Console = require('../../utils/BotConsole');

/**
 *
 * @param {import('discord.js').ChatInputCommandInteraction} interaction
 */
exports.add = async (interaction) => {
	const commandName = interaction.options.getString('command', true);
	const userORrole = interaction.options.getMentionable('user-or-role', true);
	const permission = interaction.options.getBoolean('permission', true);
	const id = (await Util.getCommands(interaction.guild)).find(cmd => cmd.name === commandName).id;

	if (userORrole instanceof Role) {
		interaction.client.commandPermissionManager.addPermissions(interaction.guild.id, commandName, [{ id: userORrole.id, type: 'ROLE', permission: permission }]);
		let roleName;
		if (userORrole.name === '@everyone') roleName = '@everyone';
		else roleName = `<@&${userORrole.id}>`;
		const msg = `${permission ? 'Allowed' : 'Disallowed'} permission to </${commandName}:${id}> for ${roleName}`;
		await interaction.editReply({
			embeds: [Util.successEmbed(msg)],
		});
	}
	else if (userORrole instanceof GuildMember) {
		interaction.client.commandPermissionManager.addPermissions(interaction.guild.id, commandName, [{ id: userORrole.id, type: 'USER', permission: permission }]);
		await interaction.editReply({
			embeds: [Util.successEmbed(`${permission ? 'Allowed' : 'Disallowed'} permission to </${commandName}:${id}> for <@${userORrole.id}>`)],
		});
	}
	else {
		Console.error('Invalid User or Role provided');
		return await interaction.editReply({
			embeds: [Util.errorEmbed('An error occured while executing the command. Please try again.')],
		});
	}
};

/**
 *
 * @param {ChatInputCommandInteraction} interaction
 */
exports.remove = async (interaction) => {
	const commandName = interaction.options.getString('command', true);
	const id = (await Util.getCommands(interaction.guild)).find(cmd => cmd.name === commandName).id;

	/**
     * @type {import('../../modules/CommandPermissionManager')}
     */
	const commandPermissionManager = interaction.client.commandPermissionManager;

	const command = commandPermissionManager.get(interaction.guild.id).find(cmd => cmd.name === commandName);

	if (command.permissions.length === 0) {
		return await interaction.editReply({
			embeds: [Util.errorEmbed('There are no command permissions set for this command.')],
		});
	}

	const selectMenuOptions = [];


	for (const permission of command.permissions) {
		const option = new StringSelectMenuOptionBuilder()
			.setValue(JSON.stringify(permission));

		if (permission.type === 'USER') {
			const user = interaction.guild.members.resolve(permission.id);
			option.setLabel(`${user.displayName} ${user.nickname ? `(${user.nickname})` : ''}`);
		}
		else if (permission.type === 'ROLE') {
			option.setLabel(interaction.guild.roles.resolve(permission.id).name);
		}

		if (permission.permission) {
			option.setEmoji(process.env.SUCCESS_EMOJI);
		}
		else {
			option.setEmoji(process.env.ERROR_EMOJI);
		}

		selectMenuOptions.push(option);
	}

	const selectMenu = new StringSelectMenuBuilder()
		.setCustomId('command-permissions-remove')
		.setPlaceholder('Select the permissions to remove...')
		.setMinValues(1)
		.setMaxValues(selectMenuOptions.length)
		.setOptions(selectMenuOptions);

	const embed = new EmbedBuilder()
		.setTitle('Remove Permission')
		.setDescription(`Select below the permissions to remove from </${commandName}:${id}>`)
		.setColor(process.env.EMBED_INFO_COLOUR);

	const row = new ActionRowBuilder()
		.setComponents(selectMenu);

	await interaction.editReply({
		embeds: [embed],
		components: [row],
	});

	const collector = new InteractionCollector(interaction.client, { filter: i => i.customId === 'command-permissions-remove', idle: 30_000 });

	const resInteraction = await collector.next.catch(() => null);

	if (resInteraction === null) {
		const selectMenu2 = selectMenu.setDisabled(true);
		const row2 = new ActionRowBuilder()
			.setComponents(selectMenu2);
		return await interaction.editReply({
			embeds: [embed],
			components: [row2],
		});
	}

	const selectMenu2 = selectMenu.setDisabled(true);
	selectMenu2.options.forEach(opt => {
		if (resInteraction.values.includes(opt.data.value)) {
			return opt.setDefault(true);
		}
	});

	const row2 = new ActionRowBuilder()
		.setComponents(selectMenu2);

	collector.on('end', async (collected, reason) => {
		if (reason === 'done') {
			await interaction.editReply({
				embeds: [embed],
				components: [row2],
			});
		}
	});

	if (resInteraction.isStringSelectMenu()) {
		commandPermissionManager.removePermissions(interaction.guild.id, commandName, resInteraction.values.map(el => JSON.parse(el)));
		resInteraction.reply({
			embeds: [Util.successEmbed(`Successfully removed ${resInteraction.values.length} permissions from </${commandName}:${id}>`)],
		});
		collector.stop('done');
	}
};

exports.clear = async (interaction) => {
	const commandName = interaction.options.getString('command', true);
	const id = (await Util.getCommands(interaction.guild)).find(cmd => cmd.name === commandName).id;

	/**
     * @type {CommandPermissionManager}
     */
	const commandPermissionManager = interaction.client.commandPermissionManager;

	commandPermissionManager.setPermissions(interaction.guild.id, commandName, []);

	return await interaction.editReply({
		embeds: [Util.successEmbed(`Successfully cleared all permissions from </${commandName}:${id}>`)],
	});
};