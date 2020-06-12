const {MessageEmbed} = require('discord.js');

module.exports = {
  name: 'help',
  usage: 'help [<command>]',
  description: 'Need some help? Don\'t worry, just ask!',
  run(client, message, args) {
    if (!args._[0]) {
      const embed = new MessageEmbed().setTitle('Help');
      embed.addFields(client.commands.map(cmd => ({
        name: cmd.name,
        value: cmd.description,
      })));
      message.channel.send(embed);
    }
    message.channel.send('Stop playing around with the bot and go code.');
  }
};
