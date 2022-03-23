import { Message, TextChannel } from 'discord.js'
import { EventEmitter } from 'events'
import Round from './Round'
import TriviaService from './TriviaService'

const ROUND_MILLISECONDS = 30 * 1000

export default class GameRound extends EventEmitter {
  round: Round
  winner: any
  channel: TextChannel
  handleMessage
  timer

  constructor(channel: TextChannel) {
    super()
    this.channel = channel
    this.handleMessage = this._handleMessage.bind(this)
  }

  async start() {
    this.channel.client.on('message', this.handleMessage)

    const trivia = await TriviaService.getQuestion()
    this.round = new Round(trivia)

    this.channel.send(this.round.formatMessage())
    this.timer = setTimeout(this.end.bind(this), ROUND_MILLISECONDS)
  }

  _handleMessage({ content, channel, author }: Message) {
    if (author.bot) {
      console.log('message is from the bot, skipping')
      return
    }
    if (channel?.id !== this.channel?.id) {
      console.log('message is outside game, skipping')
      return
    }

    const result = this.round.tryAnswer(content)
    if (result) {
      this.winner = author.id
      channel.send({
        content: `<@${author.id}> got the answer right`,
        // allowed_mentions: { users: [author.id] },
      })
      this.end()
    } else {
      // channel.send('wrong')
    }
  }

  end() {
    clearTimeout(this.timer)
    this.channel.client.off('message', this.handleMessage)
    if (!this.winner) {
      this.channel.send(`The correct answer was: ${this.round.getAnswer()}`)
    }
    this.emit('end')
  }
}
