const CommandPermissionStorageController = require('../database/CommandPermissionStorageController');

class CommandPermissionManager {
	constructor() {
		this.controller = new CommandPermissionStorageController();
	}

	add(guildId, commandName, permission) {
		return this.controller.push(guildId, { command: commandName, permission: permission });
	}
}

module.exports = CommandPermissionManager;