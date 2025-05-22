module.exports = {
  name: 'ping',
  description: 'Ping kontrol komutu',
  aliases: ['gecikme', 'ms'],  // Ek komut isimleri
  execute(message, args) {
    const msg = `Pong! Gecikme: ${message.client.ws.ping}ms`;
    message.channel.send(msg);
  },
};
