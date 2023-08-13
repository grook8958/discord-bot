const fs = require('fs');
const path = require('path');

class CachedStorage {
	/**
     * Constructor of the a CachedStorage controller.
     * @param {string} cachedStoragePath The path to the save file
     */
	constructor(cachedStoragePath) {
		/**
         * The path to the Cached Storage file
         * @type {string}
         * @readonly
         */
		this.cachedStoragePath = cachedStoragePath ?? path.join(__dirname, 'LocalStorage/_cachedStorage');

		/**
         * The Cached Storage data
         * @type {Object}
         */
		this._cachedStorage = this.fetch();
	}

	/**
     * Retrieve a specific data array from the Cached Storage.
     * @param {string} name The name of the data array
	 * @param {?boolean} force Wether to force fetch
     * @returns {Array<string>}
     */
	get(name, force = false) {
		if (typeof name != 'string') throw new TypeError('[INVALID_TYPE] "name" must be a string.');
		if (typeof force != 'boolean') throw new TypeError('[INVALID_TYPE] "force" must be a boolean.');
		if (force) this.fetch();
		return this._cachedStorage[name] ?? [];
	}

	/**
     * Set new values for a new or existing data array in the Cached Storage.
     * @param {string} name The name of this data array.
     * @param {Array<string>} data The values of this data array.
     * @returns {Array<string>}
     */
	set(name, data) {
		if (typeof name != 'string') throw new TypeError('[INVALID_TYPE] "name" must be a string.');
		if (!Array.isArray(data)) throw new TypeError('[INVALID_TYPE] "data" must be an array.');
		this._cachedStorage[name] = data;
		this.save();
		return this._cachedStorage[name] ?? null;
	}

	/**
     * Delete a data array
     * @param {string} name The name of this data array.
     * @returns {CachedStorage}
     */
	delete(name) {
		if (typeof name != 'string') throw new TypeError('[INVALID_TYPE] "name" must be a string.');
		delete this._cachedStorage[name];
		this.save();
		return this;
	}

	/**
     * Add an item to a data array.
     * @param {string} name The name of this data array.
     * @param  {...string} items The item(s) to add to this data array.
     * @returns {Array<string>}
     */
	push(name, ...items) {
		if (typeof name != 'string') throw new TypeError('[INVALID_TYPE] "name" must be a string.');
		if (!Array.isArray(items)) throw new TypeError('[INVALID_TYPE] "items" must be an array.');
		const dataArray = this.get(name);
		if (!dataArray || dataArray[0].length === 0) {
			return this.set(name, items);
		}
		else {
			dataArray.push(...items);
			return this.set(name, dataArray);
		}
	}

	remove(name, ...items) {
		if (typeof name != 'string') throw new TypeError('[INVALID_TYPE] "name" must be a string.');
		if (!Array.isArray(items)) throw new TypeError('[INVALID_TYPE] "items" must be an array.');
		return this.set(name, CachedStorage.arrayRemove(this.get(name), items));
	}

	/**
     * Retrieve all cached data from the file.
     * @param {string} _cachedStoragePath Path to the cached storage.
     * @returns {Object}
     */
	fetch(_cachedStoragePath = this.cachedStoragePath) {
		if (!fs.existsSync(_cachedStoragePath)) {fs.writeFileSync(_cachedStoragePath, '', { encoding: 'utf-8' });}
		const data = fs.readFileSync(_cachedStoragePath, { encoding: 'utf-8' }).toString().split('/');
		const cachedStorage = {};
		for (const el of data) {
			if (!el || el === undefined) break;
			const cachedDataId = el.substring(el.indexOf(':') + 1, el.indexOf(':', 1));
			const cachedData = el.replace(`:${cachedDataId}:`, '').replace('<', '').replace('>', '').split('|');
			cachedStorage[cachedDataId] = cachedData;
		}
		return cachedStorage;
	}

	/**
     * Save to the cachedStorage to its file.
     * @param {string} _cachedStoragePath The path to the cached storage
     * @returns {void}
     */
	save(_cachedStoragePath = this.cachedStoragePath) {
		const dataStringArray = [];
		for (const prop in this._cachedStorage) {
			const data = this._cachedStorage[prop];
			dataStringArray.push(`:${prop}:<${data.join('|')}>`);
		}
		const data = dataStringArray.join('/') + '/';
		fs.writeFileSync(_cachedStoragePath, data, { encoding: 'utf-8' });
	}

	static arrayRemove(arr, ...items) {
		items.forEach(item => {
			const index = arr.indexOf(item);
			arr.splice(index, 1);
		});
		return arr;
	}
}

module.exports = CachedStorage;