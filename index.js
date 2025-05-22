const { Client, Intents, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const config = require('./config');
require('dotenv').config();

const colors = {
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  white: "\x1b[37m",
  green: "\x1b[32m",
  reset: "\x1b[0m"
};

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES
	// ekleyeceğiniz özellikler ek intent gerektirebilir
  ]
});

client.prefixCommands = new Collection();
client.slashCommands  = new Collection();
client.prefix         = config.prefix;

(() => {
  const slashPath  = path.join(__dirname, 'commands', 'slash');
  const slashFiles = fs.readdirSync(slashPath).filter(f => f.endsWith('.js'));
  for (const file of slashFiles) {
    const cmd = require(path.join(slashPath, file));
    const name = cmd.name || (cmd.data && cmd.data.name);
    if (!name || !cmd.data) continue;
    client.slashCommands.set(name, cmd);
    console.log(`${colors.yellow}[SLASH]${colors.blue} Yüklendi: ${colors.white}${name}${colors.reset}`);
  }

  const prefixPath  = path.join(__dirname, 'commands', 'prefix');
  const prefixFiles = fs.readdirSync(prefixPath).filter(f => f.endsWith('.js'));
  for (const file of prefixFiles) {
    const cmd = require(path.join(prefixPath, file));
    if (!cmd.name || !cmd.execute) continue;
    client.prefixCommands.set(cmd.name, cmd);
    if (Array.isArray(cmd.aliases)) {
      for (const al of cmd.aliases) {
        client.prefixCommands.set(al, cmd);
      }
    }
    console.log(`${colors.yellow}[PREFIX]${colors.blue} Yüklendi: ${colors.white}${cmd.name}${colors.reset}`);
  }

  const eventPath  = path.join(__dirname, 'events');
  const eventFiles = fs.readdirSync(eventPath).filter(f => f.endsWith('.js'));
  for (const file of eventFiles) {
    const ev = require(path.join(eventPath, file));
    const name = ev.name || file.split('.')[0];
    if (ev.once) {
      client.once(name, (...args) => ev.execute(...args, client));
    } else {
      client.on(name,  (...args) => ev.execute(...args, client));
    }
    console.log(`${colors.yellow}[EVENT]${colors.green} Yüklendi: ${colors.white}${name}${colors.reset}`);
  }
})();

mongoose.connect(config.mongodbUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log(`${colors.yellow}[MONGO]${colors.reset} Bağlandı`))
.catch(err => console.error(`${colors.yellow}[MONGO ERROR]${colors.reset}`, err));

client.once('ready', async () => {
  console.log(`${colors.yellow}[READY]${colors.green} Logged in as:${colors.white} ${client.user.tag}${colors.reset}`);
  require('./deployCommands.js');
});

client.login(config.token);
