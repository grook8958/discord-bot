const { Events } = require('discord.js');
const Console = require('../utils/BotConsole');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		Console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};