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
var ROUND_MILLISECONDS = 7000;
var Round = /** @class */ (function (_super) {
    __extends(Round, _super);
    // timer
    // messages = []
    // winner
    function Round(trivia) {
        var _this = _super.call(this) || this;
        _this.trivia = trivia;
        return _this;
    }
    // start(){
    //     // this.timer = setTimeout(this.end.bind(this), ROUND_MILLISECONDS)
    // }
    // end(){
    //     // clearTimeout(this.timer)
    //     this.emit('end')
    // }
    Round.prototype.tryAnswer = function (answer) {
        if (answer === this.trivia.answer) {
            // this.end()
            return true;
        }
    };
    return Round;
}(events_1.EventEmitter));
exports["default"] = Round;
