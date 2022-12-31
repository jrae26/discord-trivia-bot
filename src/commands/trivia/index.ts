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
            .addNumberOption(option => option.setName('rounds')
                .setDescription('the number of rounds to play for this game (defaults to 10)')
                .setMaxValue(30)
                .setMinValue(1)
                .setRequired(false)
            )
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
            .addUserOption(option => option.setName('user').setDescription('the user whose stats should be shown (leave blank for your own stats)').setRequired(false))
    )

export const responder = async (interaction: ChatInputCommandInteraction) => {
    const subcommand = interaction.options.getSubcommand()

    switch (subcommand) {
        case 'start':
            interaction.reply('getting ready to start!')
            const rounds = interaction.options.getNumber('rounds') ?? undefined
            GameManager.startGame(interaction.channel, { rounds })
            break
        case 'leaderboard':
            respondWithLeaderboard(interaction)
            break
        case 'stats':
            respondWithPlayerStats(interaction)
            break
    }

}