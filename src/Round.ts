import { EmbedBuilder } from 'discord.js'
import { JServiceTrivia } from './TriviaService'

const specialChars = /[^a-zA-Z0-9]/g

export default class Round {
  trivia: JServiceTrivia

  constructor(trivia: JServiceTrivia) {
    this.trivia = trivia
  }

  formatMessage() {
    // @ts-ignore
    const airDate = new Date(this.trivia.airdate.$date).toLocaleDateString()
    return new EmbedBuilder()
      .setColor('#0099ff')
      .setTitle(this.trivia.category.title)
      .setDescription(this.trivia.question)
      .addFields({ name: 'Answer', value: `\`${this.getMaskedAnswer()}\`` })
      .setFooter({ text: `qid: ${this.trivia.qId}` })
  }

  getMaskedAnswer() {
    const { answer } = this.trivia
    const { length } = answer

    const maskCount = Math.max(1, Math.floor(length * 0.8))

    const maskedIndices = new Set()

    while (maskedIndices.size < maskCount) {
      maskedIndices.add(getRandomIntInclusive(0, length - 1))
    }

    return this.trivia.answer
      .split('')
      .map((c, i) => {
        if (c.match(specialChars)) return c
        return maskedIndices.has(i) ? '_' : c
      })
      .join('')
  }

  getAnswer() {
    return this.trivia.answer
  }

  tryAnswer(answer: string) {
    const sanitize = (s: string) => {
      // https://stackoverflow.com/questions/70172259/javascript-regex-to-check-if-a-string-contains-accented-characters
      return Array.from(s.normalize( 'NFD' )).filter(char => !char.match(/[^a-zA-Z0-9]/g)).join('').toLowerCase()
    }

    return sanitize(answer) === sanitize(this.trivia.answer)
  }
}

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1) + min) //The maximum is inclusive and the minimum is inclusive
}
