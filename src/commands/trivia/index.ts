import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js"
import GameManager from "../../GameManager"

export const COMMAND_NAME = 'trivia'

export const builder = new SlashCommandBuilder()
    .setName(COMMAND_NAME)
    .setDescription('trivia stuff')
    .addSubcommand(subcommand =>
        subcommand
            .setName('start')
            .setDescription('start a game of trivia')
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('stats')
            .setDescription('get player trivia stats')
            .addUserOption(option => option.setName('target').setDescription('The user').setRequired(false))
    )

export const responder = async (interaction: ChatInputCommandInteraction) => {
    const subcommand = interaction.options.getSubcommand()

    switch (subcommand){
        case 'start':
            interaction.reply('getting ready to start!')
            GameManager.startGame(interaction.channel)
            break
        case 'stats':
            interaction.reply('get player stats here')
            break
    }
    
}