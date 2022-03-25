import { Message, MessageEmbed, TextChannel, User } from 'discord.js'
import { EventEmitter } from 'events'
import GameRound from './GameRound'

const MAX_ROUNDS = 5

export default class Game extends EventEmitter {
  channel: any
  round: number = 0
  currentRound: GameRound
  record: GameRound[]
  players: Set<User['id']>
  handleMessage

  constructor(channel: TextChannel) {
    super()
    this.channel = channel
    this.record = []
    this.players = new Set()

    this.handleMessage = this._handleMessage.bind(this)
  }

  start() {
    this.channel.send('starting game')
    this.channel.client.on('message', this.handleMessage)
    this.startRound()
  }

  _handleMessage({ channel, author }: Message) {
    if (author.bot) {
      console.log('message is from the bot, skipping')
      return
    }
    if (channel?.id !== this.channel?.id) {
      console.log('message is outside game, skipping')
      return
    }
    if (!this.players.has(author.id)) {
      // channel.send(`thanks for joining us, <@${author.id}>`)
    }
    this.players.add(author.id)
  }

  startRound() {
    const gRound = new GameRound(this.channel, this.round +1)
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
    const defaultResults = Array.from(this.players).reduce((acc, player) => {
      return {
        ...acc,
        [player]: 0,
      }
    }, {})
    const results = this.record
      .filter(({ winner }) => Boolean(winner))
      .reduce((acc, record) => {
        return {
          ...acc,
          [record.winner]: (acc[record.winner] ?? 0) + 1,
        }
      }, defaultResults)

    const formattedResults = Object.keys(results)
      .map((player) => `<@${player}> - ${results[player]}`)
      .join('\n\n')

    const embed = new MessageEmbed()
      .setColor('#0099ff')
      .setTitle('Final Scores')
      .setDescription(formattedResults)

    this.channel.send('The results are in!')
    this.channel.send(embed)
  }

  end() {
    this.channel.send('ending game')
    this.channel.client.off('message', this.handleMessage)
    this.sendResults()

    this.emit('end')
  }
}
