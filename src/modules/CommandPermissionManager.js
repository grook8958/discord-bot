const { GuildMember } = require('discord.js');
const CommandPermissionStorageController = require('../database/CommandPermissionStorageController');
const Console = require('../utils/BotConsole');

class CommandPermissionManager {
	constructor() {
		this.controller = new CommandPermissionStorageController();
	}

	/**
	 * @typedef {Object} CommandPermission
	 * @property {string} id The id of user or role
	 * @property {'ROLE' | 'USER'} type The type of id
	 * @property {boolean} permission Wether they have permission or no
	 */

	/**
	 * @typedef {Object} Command
	 * @property {string} name
	 * @property {Array<CommandPermission>} permissions
	 */

	/**
	 * Set permissions for a command
	 * @param {string} guildId 
	 * @param {Array<Command>} commands 
	 * @returns {Array<Command>}}
	 */
	set(guildId, commands) {
		if (typeof guildId !== 'string') return Console.error('TypeError: guildId must be a string.');
		if (!Array.isArray(commands) || !commands.some(el => typeof el.name === 'string' && Array.isArray(el.permissions))) return Console.error('TypeError: permissions must be an array of CommandPermissions object.');
		const commandDataArray = commands.map(el => JSON.stringify(el));
		return this.controller.set(guildId, commandDataArray);
	}

	/**
	 * Add permisisons for a command
	 * @param {string} guildId 
	 * @param {Command} command 
	 * @returns {Command}
	 */
	add(guildId, command) {
		if (typeof guildId !== 'string') return Console.error('TypeError: guildId must be a string.');
		if (typeof command.name === 'string' && Array.isArray(command.permissions)) return Console.error('TypeError: permissions must be an array of CommandPermissions object.');
		return this.controller.push(guildId, command);
	}

	addPermission(guildId, commandName, permission) {
		const commands = this.get(guildId);
		const command = commands.find(cmd => cmd.name === commandName);
		

	}
	/**
	 * [ { commandName, [ ] } ]
	 */

	/**
	 * Get permissions for a command
	 * @param {string} guildId 
	 * @param {string} commandName 
	 * @returns {Array<Command>}
	 */
	get(guildId) {
		const data = this.controller.get(guildId);
		return data.map(el => JSON.parse(el));
	}

	/**
	 * Check if a member has permission to use a command.
	 * @param {string} guildId 
	 * @param {string} commandName 
	 * @param {GuildMember} member 
	 * @returns {boolean}
	 */
	hasPermission(guildId, commandName, member) {
		const command = this.get(guildId).find(cmd => cmd.name === commandName);
		for (const permission of command.permissions) {
			if (permission.type === 'USER' && permission.id === member.id && permission.permission === true) return true
			else if (permission.type === 'ROLE' && member.roles.cache.has(permission.id) && permission.permission === true) return true
			else return false
		}
	}
}

module.exports = CommandPermissionManager;