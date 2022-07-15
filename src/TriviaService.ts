import { categories, clues } from '@prisma/client'
import axios from 'axios'
import { Clue } from './models/Clue'

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

export interface JServiceTrivia extends Omit<clues, 'category'> {
  category: categories
}

export default class TriviaService {
  static async getOpenTDBQuestion(): Promise<OpenTDBTrivia> {
    const response = await axios.get(
      'https://opentdb.com/api.php?amount=10&category=9&difficulty=medium'
    )
    const question = {
      ...response.data.results[getRandomInt(10)],
    }
    question.answer = question.correct_answer
    return question
  }

  static async getJServiceQuestion(): Promise<JServiceTrivia> {
    const clue = await Clue.aggregate([
      { $sample: { size: 1 } },
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'category_docs',
        },
      },
      { $addFields: { category: { $first: '$category_docs' } } },
      { $project: { category_docs: false } },
    ])
    return clue[0]
  }

  static async getQuestion(): Promise<JServiceTrivia> {
    return await TriviaService.getJServiceQuestion()
  }
}
