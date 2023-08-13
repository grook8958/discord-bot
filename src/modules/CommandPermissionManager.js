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
	 * @returns {Array<Command>}
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

	/**
	 * Adds one or more permisisons to a command.
	 * @param {string} guildId
	 * @param {string} commandName
	 * @param  {Array<CommandPermission>} permissions
	 * @returns {Array<Command>}
	 */
	addPermissions(guildId, commandName, permissions) {
		const commands = this.get(guildId);
		if (commands.length === 0) return this.set(guildId, [{ name: commandName, permissions: permissions }]);
		const command = commands.find(cmd => cmd.name === commandName);
		command.permissions.push(...permissions);
		return this.set(guildId, commands);
	}

	/**
	 * Removes one or more permissions to a command
	 * @param {string} guildId
	 * @param {string} commandName
	 * @param {Array<CommandPermission>} permissions
	 * @returns {Array<Command>}
	 */
	removePermissions(guildId, commandName, permissions) {
		const commands = this.get(guildId);
		if (commands.length === 0) return Console.warn('Trying to remove permissions from an empty array.');
		const command = commands.find(cmd => cmd.name === commandName);
		CommandPermissionStorageController.arrayRemove(command.permissions, ...permissions);
		return this.set(guildId, commands);
	}

	/**
	 * Get permissions for a command
	 * @param {string} guildId
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
	 * @param {import('discord.js').GuildMember}
	 * @returns {boolean}
	 */
	hasPermission(guildId, commandName, member) {
		const command = this.get(guildId).find(cmd => cmd.name === commandName);
		if (command.permissions.length === 0) return null;
		for (const permission of command.permissions) {
			if (permission.type === 'USER' && permission.id === member.id && permission.permission === true) return true;
			else if (permission.type === 'ROLE' && member.roles.cache.has(permission.id) && permission.permission === true) return true;
			else return false;
		}
	}

	setPermissions(guildId, commandName, permissions) {
		const commands = this.get(guildId);
		if (commands.length === 0) return this.set(guildId, [{ name: commandName, permissions: permissions }]);
		const command = commands.find(cmd => cmd.name === commandName);
		command.permissions = permissions;
		return this.set(guildId, commands);
	}
}

module.exports = CommandPermissionManager;