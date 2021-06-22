import GameManager from "./GameManager";

const { Client, Intents } = require('discord.js');

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES] });

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', message => {
  if (message.content === 'ping') {
    message.channel.send('pong');
  }
  if(message.content === '!start'){
    const gameId = GameManager.startGame(message.channel)
    console.log(gameId)
  }

  if(message.content === '!end'){
      GameManager.endGame(message.channel)
  }
});

