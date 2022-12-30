import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { GuildMember } from "../../../models/GuildMember";

export const respondWithPlayerStats = async (interaction: ChatInputCommandInteraction) => {
    if (!interaction.guildId) {
        interaction.reply('this command must be used in a server')
        return
    }

    const user = interaction.options.getUser('target') ?? interaction.user
    const guildMember = await getGuildMemberWithCalculatedRank(user.id, interaction.guildId)
    if (!guildMember || !guildMember.trivia) {
        interaction.reply('Whoops! looks like we don\'t have stats for this user. Have they played trivia yet?')
        return
    }

    const { trivia: { totalGamesPlayed, totalCorrectAnswers }, rank } = guildMember
    const embed = new EmbedBuilder()
        .setTitle(`All-Time player stats for ${interaction.guild?.members.resolve(user.id)?.nickname}`)
        .setColor('#0099ff')
        .addFields(
            { name: 'Server Rank', value: `${rank}`, inline: true },
            { name: 'Games Played', value: `${totalGamesPlayed}`, inline: true },
            { name: 'Correct Answers', value: `${totalCorrectAnswers}`, inline: true }
        )
    interaction.reply({ embeds: [embed] })
}

interface GuildMemberRankAggregationResult extends GuildMember {
    rank: number;
}

const getGuildMemberWithCalculatedRank = async (userId: string, guildId: string) => {
    const result = (await GuildMember.aggregate<GuildMemberRankAggregationResult>([
        { $match: { guildId } },
        {
            $setWindowFields: {
                partitionBy: "$guildId",
                sortBy: { "trivia.totalCorrectAnswers": -1 },
                output: {
                    rank: {
                        $rank: {}
                    }
                }
            }
        },
        { $match: { userId } },
    ]))[0]

    return result
}