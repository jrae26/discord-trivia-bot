"use strict";
exports.__esModule = true;
var db = [{ question: 'What do you call a baby cat?', answer: 'kitten' },
    { question: 'What do you call a baby cow?', answer: 'calf' }
];
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
var TriviaService = /** @class */ (function () {
    function TriviaService() {
    }
    TriviaService.getQuestion = function () {
        return db[getRandomInt(db.length)];
    };
    return TriviaService;
}());
exports["default"] = TriviaService;
