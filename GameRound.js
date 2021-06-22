"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var events_1 = require("events");
var Round_1 = require("./Round");
var TriviaService_1 = require("./TriviaService");
var ROUND_MILLISECONDS = 25 * 1000;
var GameRound = /** @class */ (function (_super) {
    __extends(GameRound, _super);
    function GameRound(channel) {
        var _this = _super.call(this) || this;
        _this.channel = channel;
        _this.handleMessage = _this._handleMessage.bind(_this);
        return _this;
    }
    GameRound.prototype.start = function () {
        this.channel.client.on('message', this.handleMessage);
        var trivia = TriviaService_1["default"].getQuestion();
        this.round = new Round_1["default"](trivia);
        this.channel.send(trivia.question);
        this.timer = setTimeout(this.end.bind(this), ROUND_MILLISECONDS);
    };
    GameRound.prototype._handleMessage = function (_a) {
        var _b;
        var content = _a.content, channel = _a.channel, author = _a.author;
        if (author.bot) {
            console.log('message is from the bot, skipping');
            return;
        }
        if ((channel === null || channel === void 0 ? void 0 : channel.id) !== ((_b = this.channel) === null || _b === void 0 ? void 0 : _b.id)) {
            console.log('message is outside game, skipping');
            return;
        }
        var result = this.round.tryAnswer(content);
        if (result) {
            this.winner = author.id;
            channel.send({
                content: "<@" + author.id + "> got the answer right",
                allowed_mentions: { "users": [author.id] }
            });
            this.end();
        }
        else {
            channel.send('wrong');
        }
    };
    GameRound.prototype.end = function () {
        clearTimeout(this.timer);
        this.channel.client.off('message', this.handleMessage);
        this.emit('end');
    };
    return GameRound;
}(events_1.EventEmitter));
exports["default"] = GameRound;
