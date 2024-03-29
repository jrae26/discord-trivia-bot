import { GuildMember } from '../../models/GuildMember';
import { Events } from '../events';

export const updatePlayerStats = async (
  msg: Events,
  data: { results: { [key: string]: number }; winners: string[]; guildId: string }
) => {
  const { guildId, winners, results } = data

  const promises = Object.keys(results).map(async (playerId) => {

    let guildMember = await GuildMember.findOne({ guildId, userId: playerId })
    if (!guildMember) {
      guildMember = new GuildMember({ guildId, userId: playerId })
    }

    guildMember.trivia.totalCorrectAnswers += results[playerId]
    guildMember.trivia.totalGamesPlayed += 1

    if (winners.includes(playerId)) guildMember.trivia.totalGamesWon += 1

    return await guildMember.save()

  })

  await Promise.all(promises)
  console.log('player stats update complete')
}
