
module.exports = {
  run(bot, message) {
    // uploading a picture requires sending a more complicated message
    // this is called an "embed"
    const pictureEmbed =
        new Discord.MessageEmbed()
            .setTitle('Your Karas Picture for the day')
            .setImage('https://imgur.com/slphnBI.jpg');

    message.channel.send(pictureEmbed);
  }
}