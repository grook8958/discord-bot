const { ChatInputCommandInteraction, Role, GuildMember } = require("discord.js");
const Util = require("../../utils/Util");
const Console = require('../../utils/BotConsole');

/**
 * 
 * @param {ChatInputCommandInteraction} interaction 
 */
exports.add = async (interaction) => {
    const commandName = interaction.options.getString('command', true);
    const userORrole = interaction.options.getMentionable('user-or-role', true);
    const permission = interaction.options.getBoolean('permission', true);    
    const id = (await Util.getCommands(interaction.guild)).find(cmd => cmd.name === commandName).id;
    
    if (userORrole instanceof Role) {
        interaction.client.commandPermissionManager.addPermissions(interaction.guild.id, commandName, [{ id: userORrole.id, type: "ROLE", permission: permission }]);
        let roleName;
        if (userORrole.name === '@everyone') roleName = '@everyone';
        else roleName = `<@&${userORrole.id}>`
        const msg = `${permission ? 'Allowed' : 'Disallowed'} permission to </${commandName}:${id}> for ${roleName}`;
        await interaction.editReply({
            embeds: [Util.successEmbed(msg)]
        });
    } else if (userORrole instanceof GuildMember) {
        interaction.client.commandPermissionManager.addPermissions(interaction.guild.id, commandName, [{ id: userORrole.id, type: "USER", permission: permission }]);
        await interaction.editReply({
            embeds: [Util.successEmbed(`${permission ? 'Allowed' : 'Disallowed'} permission to </${commandName}:${id}> for <@${userORrole.id}>`)]
        });
    } else { 
        Console.error('Invalid User or Role provided');
        return await interaction.editReply({
            embeds: [Util.errorEmbed('An error occured while executing the command. Please try again.')]
        })
    }
}