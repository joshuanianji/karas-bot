const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'picture',
  usage: 'picture',
  description: 'Hey, how\'s it going?',
  run(client, message) {
    // uploading a picture requires sending a more complicated message
    // this is called an "embed"
    const pictureEmbed =
        new MessageEmbed()
          .setTitle('Your Karas Picture for the day')
          .setImage('https://imgur.com/slphnBI.jpg');

    message.channel.send(pictureEmbed);
  }
};