import { ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { GuildMember } from "../../../models/GuildMember";

export const respondWithPlayerStats = async (interaction: ChatInputCommandInteraction) => {
    if (!interaction.guildId) {
        interaction.reply('this command must be used in a server')
        return
    }

    const user = interaction.options.getUser('user') ?? interaction.user
    const triviaGuildMember = await getGuildMemberWithCalculatedRank(user.id, interaction.guildId)
    if (!triviaGuildMember || !triviaGuildMember.trivia) {
        interaction.reply('Whoops! looks like we don\'t have stats for this user. Have they played trivia yet?')
        return
    }

    const { trivia: { totalGamesPlayed, totalGamesWon, totalCorrectAnswers }, rank } = triviaGuildMember
    const guildMember = interaction.guild?.members.resolve(user.id)
    const embed = new EmbedBuilder()
        .setTitle(`All-Time player stats for ${guildMember?.nickname ?? guildMember?.user.username}`)
        .setColor('#0099ff')
        .addFields(
            { name: 'Server Rank', value: `${rank}`, inline: false },
            { name: 'Games Played', value: `${totalGamesPlayed}`, inline: true },
            { name: 'Games Won', value: `${totalGamesWon}`, inline: true },
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
                sortBy: { "trivia.totalGamesWon": -1 },
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