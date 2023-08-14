'use-strict';

const { Client, GatewayIntentBits, Collection } = require('discord.js');
const Console = require('./utils/BotConsole');
const path = require('path');
const fs = require('fs');

const CommandPermissionManager = require('./modules/CommandPermissionManager');
const SettingsManager = require('./modules/SettingsManager');

const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.DirectMessages, GatewayIntentBits.GuildMembers],
});

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

// Command Handler
for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);

	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	}
	else {
		Console.warn(`The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}

// Event Handler
const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	}
	else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

// Init Modules
client.commandPermissionManager = new CommandPermissionManager();
client.settingsManager = new SettingsManager();

client.login(process.env.DISCORD_TOKEN).catch(() => {
	Console.error('Invalid Discord Token');
	Console.error('Exiting process...');
	process.exitCode = 1;
});