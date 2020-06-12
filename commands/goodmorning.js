const Discord = require('discord.js')

module.exports = {
  /**
   * @param {Discord.Client} bot 
   * @param {Discord.Message} message 
   */
  run(client, message) {
    message.channel.send('Good morning Computer Science Students');
  }
};
