import { PlayerStats } from '../../models/PlayerStats'

export const updatePlayerStats = async (
  msg,
  data: { results: { [key: string]: number }; serverId: string }
) => {
  const { serverId, results } = data
  console.log(msg, data)

  const promises = Object.keys(results).map(async (playerId) => {
    console.log(playerId)
    return await PlayerStats.findOneAndUpdate(
      { playerId, serverId },
      [
        {
          $set: {
            totalCorrectAnswers: {
              $add: ['$totalCorrectAnswers', results[playerId]],
            },
          },
          totalGamesPlayed: { $add: ['$totalGamesPlayed', 1] },
        },
      ],
      { upsert: true }
    )
  })

  await Promise.all(promises)
  console.log('player stats update complete')
}
