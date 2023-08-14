const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');


module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Returns the latency of the bot.'),
	/**
	 * @param {import('discord.js').ChatInputCommandInteraction} interaction
	 */
	async execute(interaction) {
		const embed = new EmbedBuilder().setDescription('Pinging...').setColor(process.env.EMBED_INFO_COLOUR);

		const msg = await interaction.reply({
			embeds: [embed],
			fetchReply: true,
		});

		const ping = Date.now() - msg.createdTimestamp;

		const embed2 = new EmbedBuilder().setDescription(`Ping: \`${ping}\`\nWebsocket Ping: \`${interaction.client.ws.ping}\``).setColor(process.env.EMBED_INFO_COLOUR);

		await interaction.editReply({
			embeds: [embed2],
		});
	},
};