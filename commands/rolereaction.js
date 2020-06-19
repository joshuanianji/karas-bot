// eslint-disable-next-line no-unused-vars
const { Message } = require('discord.js');

module.exports = {
  name: 'rolereaction',
  usage: 'rolereaction <message_id> [<num_roles=1>]',
  description: 'Give users roles when they react to a message!',
  /**
   * @param {Message} message 
   */
  async run(client, message, args) {
    if (args._.length < 1) return message.channel.send(`Here's how to use this command: ${this.usage}`);

    let reactionMsg = await Promise.all(message.guild.channels.cache
      .filter(channel => channel.type === 'text')
      .map(async (channel) => {
        const msgs = await channel.messages.fetch();
        return msgs.find(msg => msg.id === args._[0]);
      }));
    reactionMsg = reactionMsg.find(val => !!val);
    if (!reactionMsg) return message.channel.send('Hmm, I couldn\'t find that message. Make sure the ID is correct.');

    const numRoles = parseInt(args._[1]) || 1;
    if (numRoles < 1 || numRoles > 10) return message.channel.send('That\'s not a valid number of roles!');

    const roleMessage = await message.channel.send(`Type in the name of the ${numRoles === 1 ? '' : 'first '}role!`);

    for (let i = 1; i <= numRoles; i += 1) {
      // Get the name of the role
      if (i > 1) await roleMessage.edit(`Now type in the name of role ${i}!`);
      const roleNames = await message.channel.awaitMessages(msg => msg.author.id === message.author.id, { max: 1, time: 60 * 1000 });
      if (roleNames.size < 1) return message.channel.send('I didn\'t get your message in time!');
      const roleName = roleNames.first();
      const roleToAdd = message.guild.roles.cache.find(role => role.name === roleName.content);
      if (!roleToAdd) return message.channel.send('Sorry, I couldn\'t find that role!');
      await roleName.delete({ reason: 'Finished using' });

      // Get the emoji for the role
      await roleMessage.edit('Now react to this message with the emoji you want to use!');
      const reactions = await roleMessage.awaitReactions((r, user) => user.id === message.author.id, { max: 1 });
      if (reactions.size <= 0) return message.channel.send('We didn\'t get your reaction, please try again!');
      const emoji = reactions.first().emoji.name;
      await reactionMsg.react(emoji);

      // Collect reactions for that role
      const collector = reactionMsg.createReactionCollector((r) => r.emoji.name === emoji, {dispose: true});
      collector.on('collect', (r, user) => {
        const member = message.guild.member(user);
        member.roles.add(roleToAdd, 'Requested for this role via reaction');
      });
      collector.on('remove', (r, user) => {
        const member = message.guild.member(user);
        member.roles.remove(roleToAdd, 'Removed request for role via reaction');
      });
    }

    await roleMessage.edit('Your collector is now set up!');
  }
};
