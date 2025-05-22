module.exports = {
  name: 'ready',
  once: true,
  execute(client) {
    console.log(`[READY] ${client.user.tag} olarak giriş yapıldı!`);

    const statuses = [
      'Durum yazısı 1',
      'Durum yazısı 2',
      'Durum yazısı 3'
	];
	  // daha da çoğaltabilirsiniz, değişmeyen yazı isitiyorsanız sadece 1 durum yazısı belirtin.

    let index = 0;
    setInterval(() => {
      client.user.setActivity(statuses[index], { type: 'PLAYING' }); // LISTENING, WATCHING, STREAMING vb ile değiştirilebilir
      index = (index + 1) % statuses.length;
    }, 10000); // her 10 saniyede bir durum yazısı değişir, 1000 değer 1 saniyeye eşittir
  },
};
