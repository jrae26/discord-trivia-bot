import axios from 'axios'
import { clues, PrismaClient } from '@prisma/client'

const db = [
  { question: 'What do you call a baby cat?', answer: 'kitten' },
  { question: 'What do you call a baby cow?', answer: 'calf' },
]
const https = require('https')
function getRandomInt(max) {
  return Math.floor(Math.random() * max)
}

export interface OpenTDBTrivia {
  category: string
  type: 'multiple' | 'boolean'
  difficulty: 'easy' | 'medium' | 'hard'
  question: string
  correct_answer: string
  incorrect_answers: string[]
}

export type JServiceTrivia = clues

export default class TriviaService {
  static async getOpenTDBQuestion(): Promise<OpenTDBTrivia> {
    const response = await axios.get(
      'https://opentdb.com/api.php?amount=10&category=9&difficulty=medium'
    )
    console.log(response.data.results)
    const question = {
      ...response.data.results[getRandomInt(10)],
    }
    question.answer = question.correct_answer
    return question
  }

  static async getJServiceQuestion(): Promise<JServiceTrivia> {
    const prisma = new PrismaClient()
    await prisma.$connect()
    const clue = await prisma.clues.aggregateRaw({
      pipeline: [{ $sample: { size: 1 } }],
    })
    console.log(clue)
    await prisma.$disconnect()
    // @ts-ignore
    return clue[0]
  }

  static async getQuestion(): Promise<JServiceTrivia> {
    return await TriviaService.getJServiceQuestion()
  }
}
