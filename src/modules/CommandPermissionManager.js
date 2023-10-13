const CommandPermissionStorageController = require('../database/CommandPermissionStorageController');
const Console = require('../utils/BotConsole');

class CommandPermissionManager {
	constructor() {
		this.controller = new CommandPermissionStorageController();
		this.CommandPermissionTypes = [
			'ROLE',
			'USER',
			'DISCORD_PERMISSION',
			'EVERYONE'
		]
	}

	/**
	 * @typedef {Object} CommandPermission
	 * @property {string} id The id of user or role
	 * @property {'ROLE' | 'USER' | 'DISCORD_PERMISSION' | 'EVERYONE'} type The type of id
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
	 * @param {import('discord.js').GuildMember} member
	 * @returns {boolean}
	 */
	hasPermission(guildId, commandName, member) {
		const command = this.get(guildId).find(cmd => cmd.name === commandName);
		if (!command) return null;
		if (command.permissions.length === 0) return false;
		for (const permission of command.permissions) {
			if (permission.type === 'USER' && permission.id === member.id && permission.permission === true) return true;
			else if (permission.type === 'ROLE' && member.roles.cache.has(permission.id) && permission.permission === true) return true;
			else if (permission.type === 'DISCORD_PERMISSION' && member.permissions.has(BigInt(permission.id)) && permission.permission === true) return true;
			else if (permission.type === 'EVERYONE' && permission.permission === true) return true;
			else return false;
		}
	}

	/**
	 * Set the permissions of a command
	 * @param {string} guildId
	 * @param {string} commandName
	 * @param {Array<CommandPermission>} permissions
	 */
	setPermissions(guildId, commandName, permissions) {
		if (!Array.isArray(permissions) || !permissions.some(permission =>  typeof permission.id === 'string' && this.CommandPermissionTypes.includes(permission.type) && typeof permission.permission === 'boolean')) return Console.error('TypeError: permissions must be an array.');
		const commands = this.get(guildId);
		if (commands.length === 0) return this.set(guildId, [{ name: commandName, permissions: permissions }]);
		const command = commands.find(cmd => cmd.name === commandName);
		command.permissions = permissions;
		return this.set(guildId, commands);
	}

	/**
	 * Get a set of permissions for a command in a guild
	 * @param {string} guildId
	 * @param {string} commandName 
	 * @returns {Array<CommandPermission>}
	 */
	getPermissions(guildId, commandName) {
		if (typeof guildId !== 'string') return Console.error('guildId must be a string.');
		if (typeof commandName !== 'string') return Console.error('commandName must be a string.');
		return this.get(guildId).find(x => x.name === commandName).permissions;
	}
}

module.exports = CommandPermissionManager;