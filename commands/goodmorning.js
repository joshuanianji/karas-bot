module.exports = {
  name: 'goodmorning',
  usage: 'goodmorning',
  description: 'Morning!',
  run(client, message) {
    message.channel.send('Good morning Computer Science Students!');
  }
};
