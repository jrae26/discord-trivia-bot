const db = [{question: 'What do you call a baby cat?', answer: 'kitten'}, 
    {question: 'What do you call a baby cow?', answer: 'calf'}
 ]

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

export default class TriviaService {
    static getQuestion(){
      return db[getRandomInt(db.length)]
    }
}