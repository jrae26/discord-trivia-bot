import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { GuildMember } from "../../../models/GuildMember";

export const respondWithLeaderboard = async (interaction: ChatInputCommandInteraction) => {
    if (!interaction.guildId) {
        interaction.reply('this command must be used in a server')
        return
    }

    const leaderboardResults = await aggregateLeaderboard(interaction.guildId)
    const standings = leaderboardResults.map((triviaGuildMember, i) => {
        const guildMember = interaction.guild?.members.resolve(triviaGuildMember.userId)

        return `${i + 1}. ${guildMember?.nickname ?? 'unknown'}`
    }).join('\n')

    const embed = new EmbedBuilder().setTitle(`${interaction.guild?.name} Trivia Leaderboard`).setDescription(standings).setColor('#0099ff')
    interaction.reply({ embeds: [embed] })

}

interface GuildMemberRankAggregationResult extends GuildMember {
    rank: number;
}

const aggregateLeaderboard = async (guildId: string): Promise<GuildMemberRankAggregationResult[]> => {
    const results = await GuildMember.aggregate<GuildMemberRankAggregationResult>([
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
        { $limit: 10 },
    ])

    return results
}