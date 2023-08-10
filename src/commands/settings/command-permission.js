const { ChatInputCommandInteraction, Role, GuildMember } = require("discord.js");
const Util = require("../../utils/Util");

/**
 * 
 * @param {ChatInputCommandInteraction} interaction 
 */
exports.set = async (interaction) => {
    const commandName = interaction.options.getString('command', true);
    const userORrole = interaction.options.getMentionable('user-or-role', true);
    const permission = interaction.options.getBoolean('permission', true);    
    const id = (await Util.getCommands(interaction.guild)).find(cmd => cmd.name === commandName).id;

    if (userORrole instanceof Role) {
        
        let roleName;
        if (userORrole.name === '@everyone') roleName = '@everyone';
        else roleName = `<@&${userORrole.id}>`
        const msg = `${permission ? 'Allowed' : 'Disallowed'} permission to </${commandName}:${id}> for ${roleName}`;
        
    

        await interaction.editReply({
            embeds: [Util.successEmbed(msg)]
        });
    } else if (userORrole instanceof GuildMember) {
        
        await interaction.editReply({
            embeds: [Util.successEmbed(`${permission ? 'Allowed' : 'Disallowed'} permission to </${commandName}:${id}> for <@${userORrole.id}>`)]
        });
    }

    
}