const Assignment = require('../../models/Assignment.model');

// Submodule of `assignment` command
module.exports = {
  async run(client, message, args) {
    if (!message.member.hasPermission('MANAGE_GUILD'))
      return message.channel.send(
        'Are you _trying_ to get yourself more work? Come on, dude, take a break!'
      );
    if (!args.d) return message.channel.send('Remind me when this is due again? (eg `-d "May 29, 2020"`)');
    if (!args.c) return message.channel.send('Wait, which class is this for? (eg `-c "CS 35"`)');
    if (!args._.length) return message.channel.send('What\'s the assignment called? (eg `Exercise 3 -Pooches Pet Store`)');

    await new Assignment({ deadline: args.d, course: args.c, name: args._.join(' ') }).save();
    return message.channel.send(
      'Alright, I\'ve just updated the stream with a new assignment.'
    );
  }
};