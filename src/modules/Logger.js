'use-strict';
const { EmbedBuilder, Client, ChannelType, GuildMember } = require('discord.js');
const Console = require('../utils/BotConsole');

class Logger {
    /**
     * The Logger Module
     * @param {import('discord.js').Client} client 
     * @param {string} channelID 
     */
    constructor(client) {
        if (!client instanceof Client) return Console.error('client must be an instance of DiscordJS.Client');

        /**
         * The Discord Client
         * @type {import('discord.js').Client}
         */
        this.client = client;

        /**
         * The settings manager
         * @type {import('./SettingsManager.js')}
         */
        this.settingsManager = client.settingsManager;
    }

    /**
     * Enable the Logging Module for a guild.
     * @param {string} guildId The ID of the guild
     * @param {string} channelId The channel ID to log in
     * @returns {boolean} 
     */
    enable(guildId, channelId) {
        if (typeof guildId !== 'string') return Console.error('guildID must be a string');
        if (typeof channelId !== 'string') return Console.warn('No channelID specified or is in wrong type.')
        this.settingsManager.update(guildId, { loggerChannelId: channelId, loggerEnabled: true });
        return null;
    }

    /**
     * Disable the Logging Module for a guild.
     * @param {string} guildId The ID of guild
     */
    disable(guildId) {
        if (typeof guildId !== 'string') return Console.error('guildID must be a string');
        this.settingsManager.update(guildId, { loggerEnabled: false });
        return null;
    }

    /**
     * Retrieves the logging channel ID of a guild.
     * @param {string} guildId 
     * @returns {string|null}
     */
    getChannelId(guildId) {
        if (typeof guildId !== 'string') return Console.error('guildID must be a string');
        return this.settingsManager.get(guildId).loggerChannelId ?? null;
    }

    /**
     * Log a new message in the channel
     * @param {string} guildId 
     * @param {import('discord.js').GuildMember} responsibleMember 
     * @param {import('discord.js').GuildMember} target 
     * @param {string} description 
     * @param {string} title 
     */
    async log(guildId, responsibleMember, description, title) {
        if (typeof guildId !== 'string') return Console.error('guildID must be a string');
        if (!responsibleMember instanceof GuildMember) return Console.error('responsibleMember must be an instance of DiscordJS.GuildMember.');
        if (typeof description !== 'string') return Console.error('description must be a string');
        if (typeof title !== 'string') return Console.error('title must be a string');
        if (!this.isEnabled(guildId)) return;
        const channelId = this.getChannelId(guildId);
        const embed = new EmbedBuilder()
            .setTitle(title)
            .setDescription(description)
            .setTimestamp()
            .setAuthor({name: responsibleMember.displayName, iconURL: responsibleMember.displayAvatarURL()})
            .setFooter({text: `Executed by ${responsibleMember.id}`})
            .setColor(process.env.EMBED_INFO_COLOUR)
        
        const guild = this.client.guilds.resolve(guildId);
        const channel = guild.channels.resolve(channelId);
        if (channel.type === ChannelType.GuildText) {
            await channel.send({
                embeds: [embed]
            });
        } else return Console.warn('Logging Channel must be a TextChannel');
    }
    
    /**
     * Check wether the Logger is enabled in a guild
     * @param {string} guildId The ID of the guild
     * @returns {boolean}
     */
    isEnabled(guildId) {
        if (typeof guildId !== 'string') return Console.error('guildID must be a string');
        return this.settingsManager.get(guildId).loggerEnabled;
    }
}



module.exports = Logger;