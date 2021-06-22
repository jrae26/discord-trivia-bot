"use strict";
exports.__esModule = true;
var Game_1 = require("./Game");
var GameManager = /** @class */ (function () {
    function GameManager() {
    }
    GameManager.startGame = function (channel) {
        if (GameManager.games[channel.id]) {
            channel.send('game in progress');
            return;
        }
        var game = new Game_1["default"](channel);
        GameManager.games[channel.id] = game;
        game.on('end', function () { return GameManager.endGame(channel); });
        game.start();
        return channel.id;
    };
    GameManager.endGame = function (channel) {
        console.log('ending game');
        if (!GameManager.games[channel.id]) {
            channel.send('no game in progress');
        }
        delete GameManager.games[channel.id];
    };
    GameManager.games = {};
    return GameManager;
}());
exports["default"] = GameManager;
