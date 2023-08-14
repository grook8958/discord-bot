'use-strict';

const Util = require('./Util');
const Console = require('./BotConsole');

module.exports = (envPath = '../../.env') => {
	if (process.env.DEV === true || Util.toBoolean(process.env.DEV?.toLowerCase()) === true) return;
	require('dotenv').config({ path: envPath });
	const err = false;
	if (!process.env.DISCORD_TOKEN) Console.error('Discord Token is missing.');
	if (!process.env.APPLICATION_ID) Console.error('Discord Token is missing.');
	if (err) {
		Console.error('Exiting Process...');
		process.exitCode = 1;
	}
};