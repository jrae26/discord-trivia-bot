"use strict";
exports.__esModule = true;
var GameManager_1 = require("./GameManager");
var _a = require('discord.js'), Client = _a.Client, Intents = _a.Intents;
var client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });
client.on('ready', function () {
    console.log("Logged in as " + client.user.tag + "!");
});
client.on('message', function (message) {
    if (message.content === 'ping') {
        message.channel.send('pong');
    }
    if (message.content === '!start') {
        var gameId = GameManager_1["default"].startGame(message.channel);
        console.log(gameId);
    }
    if (message.content === '!end') {
        GameManager_1["default"].endGame(message.channel);
    }
});
