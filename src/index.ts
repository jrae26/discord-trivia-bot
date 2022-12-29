import { Client, Events, GatewayIntentBits } from 'discord.js'
import dotenv from 'dotenv'
import { connect } from 'mongoose'
import { Commands } from './Commands'
import CommandManager from './commands/CommandManager'
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

client.on(Events.ClientReady, () => {
  console.log(`Logged in as ${client.user?.tag}!`)
})

client.on(Events.InteractionCreate, interaction => {
  if (!interaction.isChatInputCommand()) return
  CommandManager.handle(interaction)
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
