import { EventEmitter } from "events"

const ROUND_MILLISECONDS = 7000

export default class Round extends EventEmitter {
    trivia
    // timer
    // messages = []
    // winner

    constructor(trivia){
        super()
        this.trivia = trivia
    }

    // start(){
    //     // this.timer = setTimeout(this.end.bind(this), ROUND_MILLISECONDS)
    // }

    // end(){
    //     // clearTimeout(this.timer)
    //     this.emit('end')
    // }

    tryAnswer(answer){
        if(answer === this.trivia.answer){
            // this.end()
            return true
        }
    }
}