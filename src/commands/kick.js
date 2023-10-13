const { SlashCommandBuilder, PermissionFlagsBits, GuildMember, EmbedBuilder } = require('discord.js');
const Util = require('../utils/Util');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('kick')
		.setDescription('Kick a member.')
		.setDMPermission(false)
		.setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
		.addUserOption(opt =>
			opt.setName('member')
				.setDescription('The member to kick')
				.setRequired(true),
		)
		.addStringOption(opt =>
			opt.setName('reason')
				.setDescription('The reason why the member is being kicked.')
				.setRequired(false),
		),
	defaultPermissions: [{
		id: PermissionFlagsBits.KickMembers.toString(),
		type: 'DISCORD_PERMISSION',
		permission: true,
	}],
	/**
     * @param {import('discord.js').ChatInputCommandInteraction} interaction
     */
	execute: async (interaction) => {
		await interaction.deferReply();
		const target = interaction.options.getMember('member');
		const reason = interaction.options.getString('reason') ?? 'No reason provided';

		if (!(target instanceof GuildMember)) return await interaction.reply({ embeds: [Util.errorEmbed('Uknown Member - An error occured')] });

		/**
         * @type {import('../modules/SettingsManager')}
         */
		const settings = interaction.client.settingsManager;

		/**
         * @type {import('../modules/Logger')}
         */
		const logger = interaction.client.logger;

		/**
		 * @type {import('../modules/ModLogsManager')}
		 */
		const modLogs = interaction.client.modLogsManager;

		if (!target.kickable && !interaction.guild.members.me.permissions.has(PermissionFlagsBits.KickMembers)) return await interaction.reply({ embeds: [Util.errorEmbed('I cannot kick this user. Perhaps my permissions are wrong?')] });

		if (!settings.get(interaction.guild.id).allowAdminModeration && target.permissions.has(PermissionFlagsBits.Administrator)) {
			return await interaction.reply({
				embeds: [Util.errorEmbed('You cannot kick this user.')],
			});
		}

		if (!settings.get(interaction.guild.id).allowHigherRolesModeration && target.roles.highest.comparePositionTo(interaction.member.roles.highest) >= 1) {
			return await interaction.reply({
				embeds: [Util.errorEmbed('You cannot kick this user.')],
			});
		}
		const targetDM = await target.createDM();
		const DMEmbed = new EmbedBuilder()
			.setTitle(interaction.guild.name)
			.setDescription('You were kicked from the server.')
			.addFields({ name: 'Reason', value: reason })
			.setTimestamp()
			.setFooter({ text: 'Kicked by' + interaction.member.id })
			.setColor(process.env.EMBED_INFO_COLOUR);
		await targetDM.send({ embeds: [DMEmbed] });

		await target.kick(reason);

		await interaction.editReply({
			embeds: [Util.successEmbed(`Successfully kicked ${target.user.username} | Reason: **${reason}**`)],
		});

		await logger.log(interaction.guildId, interaction.member, `<@${interaction.user.id}> kicked <@${target.user.id}> with reason: **${reason}**`, 'Member Kicked');
		modLogs.add(interaction.guild.id, target.id, [{
			id: modLogs.ID,
			type: 'KICK',
			reason: reason,
			moderatorId: interaction.member.id,
			moderatorName: interaction.user.username,
		}]);
	},
};