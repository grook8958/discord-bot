'use-strict';
const Console = require('../utils/BotConsole');
const SettingsStorageController = require('../database/SettingsStorageController');
const Util = require('../utils/Util');

/**
 * @typedef {Object} SettingsObject
 * @property {boolean} allowAdminBypass Wether users with Administrator permissions bypass user/role permissions
 * @property {string} loggerChannelId The Channel ID in which the logs should go.
 * @property {boolean} loggerEnabled Wether the logging module is enabled.
 * @property {boolean} allowHigherRolesModeration Wether a user can moderate another user with a higher role or equal role
 * @property {boolean} allowAdminModeration Wether a user can moderate another user with the `Administrator` permission
 */

class SettingsManager {
	/**
     * The Manager of the bot's settings
     */
	constructor() {
		this.controller = new SettingsStorageController();


		/**
         * The default options
         * @type {SettingsObject}
         */
		this.defaultOptions = {
			allowAdminBypass: true,
			loggerChannelId: '',
			loggerEnabled: false,
			allowHigherRolesModeration: false,
			allowAdminModeration: false,
		};
	}

	/**
     * @typedef {Object} OptionalSettingsObject
     * @property {?boolean} allowAdminBypass Wether users with Administrator permissions bypass user/role permissions
     * @property {?string} loggerChannelId The Channel ID in which the logs should go.
     * @property {?boolean} loggerEnabled Wether the logging module is enabled.
	 * @property {?boolean} allowHigherRolesModeration Wether a user can moderate another user with a higher role or equal role
	 * @property {?boolean} allowAdminModeration Wether a user can moderate another user with the `Administrator` permission
     */

	/**
     * Merges default settings with the provided ones.
     * @param {SettingsObject} def The default options
     * @param {OptionalSettingsObject} given The options passed.
     * @returns {SettingsObject}
     */
	mergeDefault(def, given) {
		if (!given) return def;
		for (const key in def) {
			if (!Object.hasOwn(given, key) || given[key] === undefined) {
				given[key] = def[key];
			}
			else if (given[key] === Object(given[key])) {
				given[key] = this.mergeDefault(def[key], given[key]);
			}
		}
		return given;
	}

	/**
     * Set the settings
     * @param {string} guildId The guild ID associated to the settings.
     * @param {OptionalSettingsObject} settings The new settings to set.
     * @returns {SettingsObject}
     */
	set(guildId, settings) {
		if (typeof guildId !== 'string') return Console.error('TypeError: guildId must be a string.');
		if (typeof settings !== 'object') return Console.error('TypeError: settings must be an object');
		const newSettings = this.mergeDefault(this.defaultOptions, settings);
		const settingsDataArray = [JSON.stringify(newSettings)];
		return this.controller.set(guildId, settingsDataArray)[0];
	}

	/**
     * Retrieves all the settings
     * @param {string} guildId The guild ID associated to the settings.
     * @returns {SettingsObject}
     */
	get(guildId) {
		if (typeof guildId !== 'string') return Console.error('TypeError: guildId must be a string.');
		const settings = this.controller.get(guildId)[0];
		if (!settings) return {};
		else return JSON.parse(settings);
	}

	/**
     * Updates on or more settings
     * @param {string} guildId The guild ID associated to the settings.
     * @param {OptionalSettingsObject} updateSettings An object containing all the new values of the settings to change.
     * @returns {SettingsObject}
     */
	update(guildId, updateSettings) {
		if (!updateSettings) return Console.error('TypeError: Invalid settings provided.');
		if (typeof guildId !== 'string') return Console.error('TypeError: guildId must be a string.');
		const savedSettings = this.get(guildId);
		const newSettings = Util.mergeObjects(savedSettings, updateSettings);
		return this.set(guildId, newSettings);
	}
}

module.exports = SettingsManager;