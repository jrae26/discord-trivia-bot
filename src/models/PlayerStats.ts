import { Schema, model } from 'mongoose'

// 1. Create an interface representing a document in MongoDB.
export interface PlayerStats {
  playerId: string
  serverId: string
  totalCorrectAnswers: number
  totalGamesPlayed: number
}

// 2. Create a Schema corresponding to the document interface.
var playerStatsSchema = new Schema<PlayerStats>(
  {
    playerId: { type: String, required: true, unique: true },
    serverId: { type: String, required: true, unique: true },
    totalCorrectAnswers: { type: Number, default: 0 },
    totalGamesPlayed: { type: Number, default: 0 },
  },
  { timestamps: true }
)

// 3. Create a Model.
export const PlayerStats = model<PlayerStats>('PlayerStats', playerStatsSchema)
