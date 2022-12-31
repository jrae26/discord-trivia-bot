import Game, { GameOptions } from './Game'

export default class GameManager {
  static games: { [key: string]: Game } = {}
  static startGame(channel, options: GameOptions = {}) {
    if (GameManager.games[channel.id]) {
      channel.send('game in progress')
      return
    }
    const game = new Game(channel, options)
    GameManager.games[channel.id] = game
    game.on('end', () => GameManager.endGame(channel))
    game.start()
    return channel.id
  }

  static endGame(channel) {
    console.log('ending game')
    if (!GameManager.games[channel.id]) {
      channel.send('no game in progress')
    }
    delete GameManager.games[channel.id]
  }
}
