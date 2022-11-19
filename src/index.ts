import { Client, GatewayIntentBits } from 'discord.js'
import dotenv from 'dotenv'
import { connect } from 'mongoose'
import { Commands } from './Commands'
import { registerSubscribers } from './events/subscribers'
import GameManager from './GameManager'

dotenv.config()
const { DATABASE_URL } = process.env
connect(DATABASE_URL as string).then(() =>
  console.log('mongoose connection successful')
)

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user?.tag}!`)
})

const getCommandString = (command: Commands) => {
  const prefix = '>'
  const { VERSION } = process.env
  const suffix = VERSION === 'beta' ? '-beta' : ''
  return `${prefix}${command}${suffix}`
}

client.on('messageCreate', (message) => {
  if (message.content === getCommandString(Commands.start)) {
    const gameId = GameManager.startGame(message.channel)
    console.log(gameId)
  }
})

const { DISCORD_BOT_TOKEN } = process.env
client.login(DISCORD_BOT_TOKEN)

registerSubscribers()
