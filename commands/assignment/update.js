const Assignment = require('../../models/Assignment.model');

// Submodule of the `assignment` command
module.exports = {
  name: 'assignment update',
  usage: 'assignment update [-d <deadline>] [-n <new_name>] <assignment_name>',
  description: 'Need to update an assignment? Just let me know.',
  async run(client, message, args) {
    if (!args._.length) return message.channel.send('Which assignment were you wondering about again? (eg `Pooches Pet Store`)');
    if (!args.d && !args.n) return message.channel.send('What do you want me to change? (eg `-d "May 29, 2020" or `-n "Assignment 1 - Pooches Pet Store"`)');

    const asmt = await Assignment.findOne({ name: new RegExp(args._.join(' '), 'i') }).exec();
    if (args.d) {
      asmt.deadline = new Date(args.d);
      const t = asmt.deadline.getTime();
      if (t !== t) return message.channel.send('I don\'t see that date on the calendar...');
    }
    if (args.n) asmt.name = args.n;
    await asmt.save();
    message.channel.send('Alright, now go get \'er done!');
  }
};