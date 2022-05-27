import { Schema, model } from 'mongoose'

export interface Category {
  title: string
}

const categorySchema = new Schema<Category>(
  {
    title: {
      type: String,
      unique: true,
    },
  },
  { timestamps: true }
)

export const Category = model<Category>('Category', categorySchema)
