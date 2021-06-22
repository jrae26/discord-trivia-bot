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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var events_1 = require("events");
var GameRound_1 = require("./GameRound");
var MAX_ROUNDS = 3;
var Game = /** @class */ (function (_super) {
    __extends(Game, _super);
    function Game(channel) {
        var _this = _super.call(this) || this;
        _this.round = 0;
        _this.channel = channel;
        _this.record = [];
        return _this;
    }
    Game.prototype.start = function () {
        this.channel.send('starting game');
        this.startRound();
    };
    Game.prototype.startRound = function () {
        var _this = this;
        var gRound = new GameRound_1["default"](this.channel);
        this.currentRound = gRound;
        this.record.push(gRound);
        gRound.start();
        gRound.on('end', function () {
            _this.round++;
            if (_this.round === MAX_ROUNDS) {
                _this.end();
            }
            else {
                _this.startRound();
            }
        });
    };
    Game.prototype.sendResults = function () {
        var _this = this;
        var results = this.record.reduce(function (acc, record) {
            var _a;
            var _b;
            return __assign(__assign({}, acc), (_a = {}, _a[record.winner] = ((_b = acc[record.winner]) !== null && _b !== void 0 ? _b : 0) + 1, _a));
        }, {});
        Object.keys(results).forEach(function (winner) {
            _this.channel.send({
                content: "<@" + winner + "> got " + results[winner] + " questions correct",
                allowed_mentions: { "users": [winner] }
            });
        });
    };
    Game.prototype.end = function () {
        this.channel.send('ending game');
        this.sendResults();
        this.emit('end');
    };
    return Game;
}(events_1.EventEmitter));
exports["default"] = Game;
