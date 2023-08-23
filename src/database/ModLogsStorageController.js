const CachedSotrage = require('./CachedStorage');
const path = require('path');

class ModLogsStorageController extends CachedSotrage {
	/**
     * Constuctor for the cached storage controller of the command permission database
     * @param {string} cachedStoragePath The path to the save file
     */
	constructor(cachedStoragePath) {
		super(cachedStoragePath ?? path.join(__dirname, '/LocalStorage/modLogsStorage.db'));
	}
}

module.exports = ModLogsStorageController;