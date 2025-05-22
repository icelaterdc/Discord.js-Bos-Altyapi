const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
  name: 'ping',  
  data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Ping kontrol komutu'),
  async executeSlash(interaction) {
    await interaction.reply(`Pong! Gecikme: ${interaction.client.ws.ping}ms`);
  },
};
