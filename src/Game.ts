import { EventEmitter } from 'events'
import GameRound from './GameRound'

const MAX_ROUNDS = 3

export default class Game extends EventEmitter {
  channel: any
  round: number = 0
  currentRound: GameRound
  record: GameRound[]
  constructor(channel) {
    super()
    this.channel = channel
    this.record = []
  }

  start() {
    this.channel.send('starting game')
    this.startRound()
  }

  startRound() {
    const gRound = new GameRound(this.channel)
    this.currentRound = gRound
    this.record.push(gRound)
    gRound.start()
    gRound.on('end', () => {
      this.round++
      if (this.round === MAX_ROUNDS) {
        this.end()
      } else {
        this.startRound()
      }
    })
  }

  sendResults() {
    const results = this.record
      .filter(({ winner }) => Boolean(winner))
      .reduce((acc, record) => {
        return {
          ...acc,
          [record.winner]: (acc[record.winner] ?? 0) + 1,
        }
      }, {})

    Object.keys(results).forEach((winner) => {
      this.channel.send({
        content: `<@${winner}> got ${results[winner]} questions correct`,
        allowed_mentions: { users: [winner] },
      })
    })
  }

  end() {
    this.channel.send('ending game')
    this.sendResults()

    this.emit('end')
  }
}
