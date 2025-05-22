module.exports = {
  name: 'messageCreate',
  async execute(message, client) {
    if (!message.content.startsWith(client.prefix) || message.author.bot) return;
    
    const args = message.content.slice(client.prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    
    const command = client.prefixCommands.get(commandName) ||
      client.prefixCommands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    
    if (!command) return;
    
    try {
      await command.execute(message, args);
    } catch (error) {
      console.error(`[PREFIX HATA] ${error}`);
      message.reply('Komutu yürütürken bir hata oluştu.');
    }
  },
};
