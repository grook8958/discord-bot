const CommandPermissionStorageController = require('../database/CommandPermissionStorageController');
const Console = require('../utils/BotConsole');

class CommandPermissionManager {
	constructor() {
		this.controller = new CommandPermissionStorageController();
	}

	/**
	 * 
	 * @param {string} guildId 
	 * @param {string} commandName 
	 * @param {{id: string, type: 'ROLE' | 'USER', permission: boolean}} permission 
	 * @returns 
	 */
	add(guildId, commandName, permissions) {
		if (typeof guildId !== 'string') return Console.error('TypeError: guildId must be a string.');
		if (typeof commandName !== 'string') return Console.error('TypeError: commandName must be a string.');
		if (permissions) return
		return this.controller.push(guildId, JSON.stringify({ command: commandName, permission: permission }));
	}
}

module.exports = CommandPermissionManager;