import { ChatInputCommandInteraction } from "discord.js"

import * as ping from './ping'

class CommandManager {
    private commands: { [commandName: string]: (interaction: ChatInputCommandInteraction) => void } = {}
    register(commandName: string, responder: (interaction: ChatInputCommandInteraction) => void) {
        if (this.commands[commandName])
            throw new Error(`command already registered with manager for name ${commandName}`)

        this.commands[commandName] = responder
    }

    handle(interaction: ChatInputCommandInteraction) {
        const responder = this.commands[interaction.commandName]
        responder(interaction)
    }
}

const singleton = new CommandManager()

// TODO: restructure this so that commands can self-register
const DEFAULT_COMMANDS = [ping]

DEFAULT_COMMANDS.forEach(command => {
    singleton.register(command.COMMAND_NAME, command.responder)
    console.log(`registered responder for command: ${command.COMMAND_NAME}`)
})

export default singleton