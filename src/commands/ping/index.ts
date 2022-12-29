import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

export const COMMAND_NAME = 'ping'

export const builder = new SlashCommandBuilder().setName(COMMAND_NAME).setDescription('replies with pong')

export const responder = async (interaction: ChatInputCommandInteraction) => interaction.reply('pong')