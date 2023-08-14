'use-strict';
const { EmbedBuilder } = require('discord.js');
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
	 * @param {import('discord.js').Guild} guild
	 * @returns
	 */
	static async getCommands(guild) {
		const commands = await guild.commands.fetch();
		return commands;
	}

	/**
	 * Updates an object according to a `change` object.
	 * @param {object} object The object to update
	 * @param {object} change What to change in the `object`
	 * @returns {Object}
	 */
	static mergeObjects(object, change) {
		if (Object.is(object, change)) return;

		const newObject = object;
		const objectFields = [];
		for (const prop in newObject) {
			if (typeof newObject[prop] !== 'object') continue;
			if (
				Object.getOwnPropertyDescriptors(newObject)[prop].configurable === false ||
				Object.getOwnPropertyDescriptors(newObject)[prop].enumerable === false ||
				Object.getOwnPropertyDescriptors(newObject)[prop].writable === false
			) {continue;}
			objectFields.push(prop);
		}
		for (const prop of objectFields) {
			for (const key of Object.keys(change[prop])) {
				if (typeof newObject[prop][key] !== 'object') {
					newObject[prop][key] = change[prop][key];
				}
				else {
					this.updateDocument(newObject[prop], change[prop]);
				}
			}
		}
		return newObject;
	}
}

module.exports = Util;