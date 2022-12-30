import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js"
import GameManager from "../../GameManager"
import { respondWithLeaderboard } from "./responders/leaderboard"
import { respondWithPlayerStats } from "./responders/stats"

export const COMMAND_NAME = 'trivia'

export const builder = new SlashCommandBuilder()
    .setName(COMMAND_NAME)
    .setDescription('trivia stuff')
    .addSubcommand(subcommand =>
        subcommand
            .setName('start')
            .setDescription('start a game of trivia in this channel')
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('leaderboard')
            .setDescription('show the leaderboard for this server')
    )
    .addSubcommand(subcommand =>
        subcommand
            .setName('stats')
            .setDescription('show all-time player trivia stats')
            .addUserOption(option => option.setName('target').setDescription('the user whose stats should be shown (leave blank for your own stats)').setRequired(false))
    )

export const responder = async (interaction: ChatInputCommandInteraction) => {
    const subcommand = interaction.options.getSubcommand()

    switch (subcommand) {
        case 'start':
            interaction.reply('getting ready to start!')
            GameManager.startGame(interaction.channel)
            break
        case 'leaderboard':
            respondWithLeaderboard(interaction)
            break
        case 'stats':
            respondWithPlayerStats(interaction)
            break
    }

}