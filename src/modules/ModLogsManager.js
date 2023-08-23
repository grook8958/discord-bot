'use-strict';
const Console = require('../utils/BotConsole');
const ModLogsStorageController = require('../database/ModLogsStorageController');

/**
 * @typedef {Object} ModLog
 * @property {string} id Unique identifier of the mod log
 * @property {'WARN'|'MUTE'|'KICK'|'BAN'} type Type of moderation action taken
 * @property {string} reason Reason of the moderation action
 * @property {string} moderatorId The Mod's ID
 * @property {string} moderatorName The Mod's name
 * @property {?string} duration The duration of the mute
 */

/**
 * @typedef {Object} ModLogUser
 * @property {string} userId
 * @property {Array<ModLog>} modLogs
 */

class ModLogsManager {
	/**
     * The manager of ModLogs
     */
	constructor() {
		this.controller = new ModLogsStorageController();
	}


	/**
     * Set the modlogs for a user.
     * @param {string} guildId
     * @param {string} userId
     * @param {Array<ModLog>} modLogs
     */
	setModLogs(guildId, userId, modLogs) {
		if (typeof guildId !== 'string') return Console.error('TypeError: guildId must be a string.');
		if (typeof userId !== 'string') return Console.error('TypeError: userId must be a string.');
		if (!Array.isArray(modLogs)) return Console.error('TypeError: modLogs must be an array.');
		const userData = this.getUser(guildId, userId);
		this.controller.remove(guildId, JSON.stringify(userData));
		userData.modLogs = modLogs;
		return this.controller.push(guildId, JSON.stringify(userData));
	}


	/**
     *
     * @param {string} guildId
     * @param {string} userId
     * @returns {ModLogUser}
     */
	getUser(guildId, userId) {
		if (typeof guildId !== 'string') return Console.error('TypeError: guildId must be a string.');
		if (typeof userId !== 'string') return Console.error('TypeError: userId must be a string.');
		/**
         * @type {ModLogUser}
         */
		const userData = this.controller.get(guildId).map(el => JSON.parse(el)).find(data => data.userId === userId);
		if (!userData) {
			const newData = { userId: userId, modLogs: [] };
			this.controller.push(guildId, JSON.stringify(newData));
			return newData;
		}
		return userData;
	}

	/**
     * Adds ModLogs to a user
     * @param {string} guildId
     * @param {string} userId
     * @param {Array<ModLog>} modLogs
     */
	addModLogs(guildId, userId, modLogs) {
		if (typeof guildId !== 'string') return Console.error('TypeError: guildId must be a string.');
		if (typeof userId !== 'string') return Console.error('TypeError: userId must be a string.');
		if (!Array.isArray(modLogs)) return Console.error('TypeError: modLogs must be an array.');
		const userData = this.getUser(guildId, userId);
		userData.modLogs.push(...modLogs);
		return this.setModLogs(guildId, userId, userData.modLogs);
	}

	/**
     * Removes modLogs using ID
     * @param {string} guildId
     * @param {string} userId
     * @param {Array<string} modLogsIds
     */
	removeModLogs(guildId, userId, modLogsIds) {
		if (typeof guildId !== 'string') return Console.error('TypeError: guildId must be a string.');
		if (typeof userId !== 'string') return Console.error('TypeError: userId must be a string.');
		if (!Array.isArray(modLogsIds)) return Console.error('TypeError: modLogsIds must be an array.');
		const userData = this.getUser(guildId, userId);
		const modLogs = modLogsIds.map(el => userData.modLogs.find(e => e.id === el));
		ModLogsStorageController.arrayRemove(userData.modLogs, modLogs);
		return this.setModLogs(guildId, userId, userData.modLogs);
	}
}

module.exports = ModLogsManager;