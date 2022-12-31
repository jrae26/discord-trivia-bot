import { Schema, model } from 'mongoose'
import { GuildMemberTrivia, guildMemberTriviaSchema } from './trivia'

export interface GuildMember {
  userId: string
  guildId: string
  trivia: GuildMemberTrivia
}

const guildMemberSchema = new Schema<GuildMember>(
  {
    userId: { type: String, required: true },
    guildId: { type: String, required: true },
    trivia: guildMemberTriviaSchema
  },
  { timestamps: true }
)

guildMemberSchema.index({ userId: 1, guildId: 1 }, { unique: true })

export const GuildMember = model<GuildMember>('GuildMember', guildMemberSchema)