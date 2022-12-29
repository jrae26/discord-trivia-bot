import dotenv from 'dotenv'
import { REST, Routes } from "discord.js";
import { builder } from '../commands/ping';

dotenv.config()
const { DISCORD_BOT_TOKEN, CLIENT_ID, GUILD_ID } = process.env

const commands = [builder.toJSON()]

const rest = new REST({ version: '10' }).setToken(DISCORD_BOT_TOKEN ?? '')

const deployCommands = async () => {
    console.log('deploying commands...')
    try {
        await rest.put(Routes.applicationGuildCommands(CLIENT_ID ?? '', GUILD_ID ?? ''), { body: commands })
    }
    catch (error) {
        console.error(error)
    }
    console.log('successfully deployed ', commands.length, ' commands')
}

deployCommands()