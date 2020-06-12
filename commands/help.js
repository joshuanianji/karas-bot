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
      return message.channel.send(embed);
    }
    
    const cmdName = args._.shift().toLowerCase();
    if (client.commands.has(cmdName)) {
      const cmd = client.commands.get(cmdName);
      const embed = new MessageEmbed();

      if (args._.length > 0) {
        const subcommandName = args._.shift().toLowerCase();
        if (cmd.subcommands && cmd.subcommands.has(subcommandName)) {
          const subcommand = cmd.subcommands.get(subcommandName);
          embed
            .setTitle(subcommandName)
            .setDescription(subcommand.description)
            .addField('Usage', subcommand.usage);
          return message.channel.send(embed);
        }
      }

      embed
        .setTitle(cmdName)
        .setDescription(cmd.description)
        .addField('Usage', cmd.usage);
      if (cmd.subcommands) embed.addFields(cmd.subcommands.map((subcmd) => ({
        name: subcmd.name,
        value: subcmd.description,
      })));
      message.channel.send(embed);
    } else {
      message.channel.send('Are you sure you\'re typing that correctly?');
    }
  }
};
