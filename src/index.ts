import { Client, Intents } from 'discord.js'
import dotenv from 'dotenv'
import { Commands } from './Commands'
import GameManager from './GameManager'

dotenv.config()

const client = new Client({})

client.on('ready', () => {
  console.log(`Logged in as ${client.user?.tag}!`)
})

const getCommandString = (command: Commands) => {
  const prefix = '>'
  const { VERSION } = process.env
  const suffix = VERSION === 'beta' ? '-beta' : ''
  return `${prefix}${command}${suffix}`
}

client.on('message', (message) => {
  if (message.content === getCommandString(Commands.start)) {
    const gameId = GameManager.startGame(message.channel)
    console.log(gameId)
  }
})

const { DISCORD_BOT_TOKEN } = process.env
client.login(DISCORD_BOT_TOKEN)
