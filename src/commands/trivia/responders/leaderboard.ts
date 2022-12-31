import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { GuildMember } from "../../../models/GuildMember";

export const respondWithLeaderboard = async (interaction: ChatInputCommandInteraction) => {
    if (!interaction.guildId) {
        interaction.reply('this command must be used in a server')
        return
    }

    const leaderboardResults = await aggregateLeaderboard(interaction.guildId)
    const emptyBoard = 'No results to show yet. Play some games to get on the board!'

    const standings = leaderboardResults.map((triviaGuildMember, i) => {
        const guildMember = interaction.guild?.members.resolve(triviaGuildMember.userId)

        if (!guildMember) return 'unknown'

        return `${i + 1}. ${guildMember.nickname ?? guildMember.user.username}`
    }).join('\n')

    const embed = new EmbedBuilder().setTitle(`${interaction.guild?.name} Trivia Leaderboard`).setDescription(standings || emptyBoard).setColor('#0099ff')

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
                sortBy: { "trivia.totalGamesWon": -1 },
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