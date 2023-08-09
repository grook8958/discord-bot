const { ChatInputCommandInteraction, Role, GuildMember, ApplicationCommandPermissionType } = require("discord.js");
const Util = require("../../utils/Util");

/**
 * 
 * @param {ChatInputCommandInteraction} interaction 
 */
exports.set = async (interaction) => {
    const commandName = interaction.options.getString('command', true);
    const userORrole = interaction.options.getMentionable('user-or-role', true);
    const permission = interaction.options.getBoolean('permission', true);    
    
    if (userORrole instanceof Role) {
        
        await interaction.editReply({
            embeds: [Util.successEmbed(`${permission ? 'Allowed' : 'Disallowed'} permission to ${commandName} for <&${userORrole.id}>`)]
        });
    } else if (userORrole instanceof GuildMember) {
        
        await interaction.editReply({
            embeds: [Util.successEmbed(`${permission ? 'Allowed' : 'Disallowed'} permission to ${commandName} for <@${userORrole.id}>`)]
        });
    }

    
}