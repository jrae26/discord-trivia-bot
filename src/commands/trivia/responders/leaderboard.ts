import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { GuildMember } from "../../../models/GuildMember";

export const respondWithLeaderboard = async (interaction: ChatInputCommandInteraction) => {
    if (!interaction.guildId) {
        interaction.reply('this command must be used in a server')
        return
    }

    await interaction.deferReply()

    const leaderboardResults = await aggregateLeaderboard(interaction.guildId)
    const emptyBoard = 'No results to show yet. Play some games to get on the board!'

    const userIds = leaderboardResults.map(({ userId }) => userId)

    const guildMembers = await interaction.guild?.members.fetch({ user: userIds })

    const standings = leaderboardResults.map((triviaGuildMember, i) => {
        const guildMember = guildMembers?.find(({ id }) => id === triviaGuildMember.userId)

        if (!guildMember) return 'unknown'

        return `${i + 1}. ${guildMember.nickname ?? guildMember.user.username}`
    }).join('\n')

    const embed = new EmbedBuilder().setTitle(`${interaction.guild?.name} Trivia Leaderboard`).setDescription(standings || emptyBoard).setColor('#0099ff')

    interaction.editReply({ embeds: [embed] })

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