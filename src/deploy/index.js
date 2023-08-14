const { REST, Routes } = require('discord.js');
const Console = require('../utils/BotConsole');
const fs = require('node:fs');
const path = require('node:path');
console.log(process.env);
const commands = [];
// Grab all the command files from the commands directory you created earlier
const folderPath = path.resolve('./src/commands');
const commandFolder = fs.readdirSync(folderPath).filter(file => file.endsWith('.js'));

for (const file of commandFolder) {
	// Grab all the command files from the commands directory you created earlier
	const filePath = path.join(folderPath, file);
	// Grab the SlashCommandBuilder#toJSON() output of each command's data for deployment
	const command = require(filePath);
	if ('data' in command && 'execute' in command) {
		commands.push(command.data.toJSON());
	}
	else {
		Console.warn(`The command at ${filePath} is missing a required "data" or "execute" property.`);
	}
}


// Construct and prepare an instance of the REST module
const rest = new REST().setToken(process.env.DISCORD_TOKEN);

// and deploy your commands!
(async () => {
	try {
		Console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// The put method is used to fully refresh all global commands with the current set
		const data = await rest.put(
			Routes.applicationCommands(process.env.APPLICATION_ID),
			{ body: commands },
		);

		Console.log(`Successfully reloaded ${data.length} application (/) commands.`);
	}
	catch (error) {
		Console.error('Error Deploying Commands. Perhaps the Client/Application ID is wrong?');
		Console.error(error);
	}
})();