import { Schema, Types, model } from 'mongoose'

export interface Clue {
  airdate: Date
  answer: string
  question: string
  value: number
  gameId: number
  qId: string
  category: Types.ObjectId
}

var clueSchema = new Schema<Clue>(
  {
    airdate: Date,
    answer: String,
    question: String,
    value: Number,
    gameId: Number,
    qId: String,
    category: { type: Schema.Types.ObjectId, ref: 'Category' },
  },
  { timestamps: true }
)

export const Clue = model<Clue>('Clue', clueSchema)
