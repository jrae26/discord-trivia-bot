import { Schema } from "mongoose";

export interface GuildMemberTrivia {
    totalCorrectAnswers: number
    totalGamesPlayed: number
}

export const guildMemberTriviaSchema = {
    totalCorrectAnswers: { type: Number, default: 0 },
    totalGamesPlayed: { type: Number, default: 0 },
}