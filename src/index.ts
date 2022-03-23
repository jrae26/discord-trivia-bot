import { Client, Intents } from 'discord.js'
import dotenv from 'dotenv'
import GameManager from './GameManager'

dotenv.config()

// const { Client, Intents } = require('discord.js')

const client = new Client({
  // intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
})

client.on('ready', () => {
  console.log(`Logged in as ${client.user?.tag}!`)
})

client.on('message', (message) => {
  if (message.content === 'ping') {
    message.channel.send('pong')
  }
  if (message.content === '!beta') {
    const gameId = GameManager.startGame(message.channel)
    console.log(gameId)
  }

  if (message.content === '!end') {
    GameManager.endGame(message.channel)
  }
})

const { DISCORD_BOT_TOKEN } = process.env
client.login(DISCORD_BOT_TOKEN)
