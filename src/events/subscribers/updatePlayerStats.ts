import { PlayerStats } from '../../models/PlayerStats'

export const updatePlayerStats = async (
  msg,
  data: { results: { [key: string]: number }; serverId: string }
) => {
  const { serverId, results } = data
  console.log(msg, data)

  const promises = Object.keys(results).map(async (playerId) => {
    console.log(playerId)

    let stats = await PlayerStats.findOne({ playerId, serverId }, { upsert: true })
    if (!stats) stats = new PlayerStats({ playerId, serverId })
    
    stats.totalCorrectAnswers += results[playerId]
    stats.totalGamesPlayed += 1
    
    return await stats.save()
  })

  await Promise.all(promises)
  console.log('player stats update complete')
}
