require('dotenv').config()

const { REST } = require('@discordjs/rest')
const { Client, Intents } = require('discord.js')
const { Routes } = require('discord-api-types/v9')
const fetch = require('node-fetch')

const { COMMAND, TRIGGER, TOKEN, CLIENT_ID, GUILD_ID } = process.env

const commands = [{
  name: COMMAND,
  description: 'Starts satisfactory server'
}]

const rest = new REST({ version: '9' }).setToken(TOKEN);

(async () => {
  try {
    console.log('Started refreshing application (/) commands.');

    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: commands },
    );

    console.log('Successfully reloaded application (/) commands.');
  } catch (error) {
    console.log(error)
  }
})();

const client = new Client({ intents: [Intents.FLAGS.GUILDS ]})

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isCommand()) return;

  if (interaction.commandName === COMMAND) {
    try {
      const json = await fetch(TRIGGER)
      const result = json.json()

      console.log(result)

      interaction.reply('Satisfactory server started!')
    } catch (error) {
      console.log(error)

      interaction.reply('Error starting satisfactory service')
    }
  }
});

client.login(TOKEN);