const CachedSotrage = require('./CachedStorage');

class GiveawayStorageController extends CachedSotrage {
	/**
     * Constuctor for the cached storage controller of the giveaway database
     * @param {string} cachedStoragePath The path to the save file
     */
	constructor(cachedStoragePath) {
		super(cachedStoragePath);
	}
}

module.exports = GiveawayStorageController;