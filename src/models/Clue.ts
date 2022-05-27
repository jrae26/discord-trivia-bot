import { Schema, Types, model } from 'mongoose'

// 1. Create an interface representing a document in MongoDB.
export interface Clue {
  airdate: Date
  answer: string
  question: string
  value: number
  gameId: number
  qId: string
  category: Types.ObjectId
}

// 2. Create a Schema corresponding to the document interface.
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

// 3. Create a Model.
export const Clue = model<Clue>('Clue', clueSchema)
