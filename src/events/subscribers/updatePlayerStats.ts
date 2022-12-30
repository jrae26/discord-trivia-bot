import { GuildMember } from '../../models/GuildMember';

export const updatePlayerStats = async (
  msg,
  data: { results: { [key: string]: number }; guildId: string }
) => {
  const { guildId, results } = data

  const promises = Object.keys(results).map(async (playerId) => {

    let guildMember = await GuildMember.findOne({ guildId, userId: playerId })
    if (!guildMember) {
      guildMember = new GuildMember({ guildId, userId: playerId })
    }

    guildMember.trivia.totalCorrectAnswers += results[playerId]
    guildMember.trivia.totalGamesPlayed += 1

    return await guildMember.save()

  })

  await Promise.all(promises)
  console.log('player stats update complete')
}
