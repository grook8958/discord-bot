'use-strict';
const Util = require('./Util');
const { PermissionFlagsBits } = require('discord.js')
/**
 * 
 * @param {import('../modules/CommandPermissionManager')} commandPermissionManager 
 * @param {string[]} guildIds
 */
module.exports = async (commandPermissionManager, guildIds, client) => {
    for (const guildId of guildIds) {
        if (commandPermissionManager.get(guildId).length > 0) return;
        const commands = [];
        for (const command of client.commands) {
            commands.push({
                name: command[0],
                permissions: command[1].defaultPermissions,
            });
        };
        commandPermissionManager.set(guildId, commands);
    };
};