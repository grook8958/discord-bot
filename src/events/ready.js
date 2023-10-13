const { Events } = require('discord.js');
const Console = require('../utils/BotConsole');
const InitialPermissions = require('../utils/InitialPermissions');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		Console.log(`Ready! Logged in as ${client.user.tag}`);
		// Add the initial permissions on first launch
		InitialPermissions(client.commandPermissionManager, client.guilds.cache.map(guild => guild.id), client); 
	},
};