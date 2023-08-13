'use-strict';

const Util = require('./Util');

module.exports = (envPath = '../../.env') => {
	if (process.env.DEV === true || Util.toBoolean(process.env.DEV?.toLowerCase()) === true) return;
	require('dotenv').config({ path: envPath });
};