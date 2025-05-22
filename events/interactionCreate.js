module.exports = {
  name: 'interactionCreate',
  async execute(interaction, client) {
    if (!interaction.isCommand()) return;

    const command = client.slashCommands.get(interaction.commandName);
    if (!command) return;

    try {
      await command.executeSlash(interaction);
    } catch (error) {
      console.error('[SLASH HATA]', error);
      if (interaction.replied || interaction.deferred) {
        await interaction.followUp({ content: 'Komut çalıştırılırken bir hata oluştu.', ephemeral: true });
      } else {
        await interaction.reply({ content: 'Komut çalıştırılırken bir hata oluştu.', ephemeral: true });
      }
    }
  },
};
