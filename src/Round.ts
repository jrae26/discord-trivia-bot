import { EventEmitter } from 'events'
import { MessageEmbed } from 'discord.js'
import { JServiceTrivia, OpenTDBTrivia } from './TriviaService'

export default class Round extends EventEmitter {
  trivia: JServiceTrivia

  constructor(trivia: JServiceTrivia) {
    super()
    this.trivia = trivia
  }

  formatMessage() {
    return new MessageEmbed()
      .setColor('#0099ff')
      .setTitle(this.trivia.category)
      .setDescription(this.trivia.question)
      .addField('Answer', this.getMaskedAnswer())
  }

  getMaskedAnswer() {
    const { answer } = this.trivia
    const { length } = answer

    const maskCount = Math.floor(length * 0.8)

    const maskedIndices = new Set()

    while (maskedIndices.size < maskCount) {
      maskedIndices.add(getRandomIntInclusive(0, length - 1))
    }

    return this.trivia.answer
      .split('')
      .map((c, i) => (maskedIndices.has(i) ? '\\_' : c))
      .join('')
  }

  getAnswer() {
    return this.trivia.answer
  }

  tryAnswer(answer) {
    if (answer === this.trivia.answer) {
      return true
    }
  }
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1) + min) //The maximum is inclusive and the minimum is inclusive
}
