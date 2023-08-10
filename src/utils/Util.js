'use-strict';
const { EmbedBuilder, Guild } = require('discord.js');
const path = require('path');
const fs = require('fs');

class Util extends null {

	/**
     * Converts a string to a boolean
     * @param {string} string
     */
	static toBoolean(string) {
		const converter = {
			'true': true,
			'false': false,
		};
		return converter[string];
	}

	static successEmbed(description) {
		return new EmbedBuilder()
			.setColor(process.env.EMBED_SUCCESS_COLOUR)
			.setDescription(`${process.env.SUCCESS_EMOJI} ${description}`);
	}

	static errorEmbed(description) {
		return new EmbedBuilder()
			.setColor(process.env.EMBED_ERROR_COLOUR)
			.setDescription(`${process.env.ERROR_EMOJI} ${description}`);
	}

	static getCommandNames() {
		const commands = [];
		// Grab all the command files from the commands directory you created earlier
		const folderPath = path.resolve('./src/commands');
		const commandFolder = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));

		for (const file of commandFolder) {
			commands.push(file.replace('.js', ''));
		}

		return commands;
	}

	/**
	 * 
	 * @param {Guild} guild 
	 * @returns 
	 */
	static async getCommands(guild) {
		const commands = await guild.commands.fetch();
		return commands;
	}
}

module.exports = Util;