import { Message, EmbedBuilder, TextChannel, User } from 'discord.js'
import { EventEmitter } from 'events'
import PubSub from 'pubsub-js'
import { Events } from './events/events'
import GameRound from './GameRound'

const MAX_ROUNDS = 10

export interface GameOptions {
  rounds?: number
}

export default class Game extends EventEmitter {
  channel: TextChannel
  round: number = 0
  currentRound: GameRound
  record: GameRound[]
  players: Set<User['id']>
  handleMessage
  private max_rounds = MAX_ROUNDS

  constructor(channel: TextChannel, options: GameOptions = {}) {
    super()
    this.channel = channel
    this.record = []
    this.players = new Set()

    this.handleMessage = this._handleMessage.bind(this)

    if (options.rounds) this.max_rounds = options.rounds
  }

  start() {
    this.channel.client.on('messageCreate', this.handleMessage)
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

    this.players.add(author.id)
  }

  startRound() {
    const gRound = new GameRound(this.channel, this.round + 1)
    this.currentRound = gRound
    this.record.push(gRound)
    gRound.on('end', () => {
      this.round++
      if (this.round === this.max_rounds) {
        this.end()
      } else {
        this.startRound()
      }
    })
    gRound.start()
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

    const orderedPlayers = Object.keys(results)
      .sort((playerA, playerB) => results[playerB] - results[playerA])

    const winningScore = results[orderedPlayers[0]]
    let winners: string[] = []

    if(winningScore > 0){
      winners = orderedPlayers.filter(player => results[player] === winningScore)
    }

    PubSub.publish(Events.GAME_END, {
      results,
      winners: winners,
      guildId: this.channel.guild.id,
    })

    const formattedResults = orderedPlayers
      .map((player) => `<@${player}> - ${results[player]}`)
      .join('\n\n')

    const embed = new EmbedBuilder().setColor('#0099ff')
      .setTitle('Final Scores')
      .setDescription(formattedResults)

    this.channel.send('The results are in!')
    this.channel.send({ embeds: [embed] })
  }

  end() {
    this.channel.client.off('messageCreate', this.handleMessage)
    this.sendResults()

    this.emit('end')
  }
}
