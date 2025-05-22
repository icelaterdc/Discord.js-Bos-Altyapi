const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const fs = require('fs');
const config = require('./config');
const colors = {
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  white: "\x1b[37m",
  reset: "\x1b[0m"
};

const commands = [];
const slashCommandFiles = fs.readdirSync('./commands/slash').filter(file => file.endsWith('.js'));

for (const file of slashCommandFiles) {
  const command = require(`./commands/slash/${file}`);
  if (command.data) {
    commands.push(command.data.toJSON());
  } else {
    console.warn(`${colors.yellow}[DEPLOY]${colors.blue} Komut Yüklemesi:${colors.white} ${file} data özelliğine sahip değil!${colors.reset}`);
  }
}

const rest = new REST({ version: '9' }).setToken(config.token);

(async () => {
  try {
    console.log(`${colors.yellow}[DEPLOY]${colors.reset} Global slash komutları deploy ediliyor...`);
    await rest.put(
      Routes.applicationCommands(config.clientId),
      { body: commands }
    );
    console.log(`${colors.yellow}[DEPLOY]${colors.reset} Global slash komutları başarıyla deploy edildi.`);
  } catch (error) {
    console.error(`${colors.yellow}[DEPLOY ERROR]${colors.reset}`, error);
  }
})();
