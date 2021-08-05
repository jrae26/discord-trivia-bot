import axios from "axios";

const db = [{ question: 'What do you call a baby cat?', answer: 'kitten' },
{ question: 'What do you call a baby cow?', answer: 'calf' }
]
const https = require('https')
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

export default class TriviaService {
  static async getQuestion() {
    const response = await axios.get('https://opentdb.com/api.php?amount=10&category=9&difficulty=medium')
    console.log(response.data.results)
    return response.data.results[getRandomInt(10)]
  }
}