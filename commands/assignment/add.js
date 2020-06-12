const Assignment = require('../../models/Assignment.model');

module.exports = {
  async run(client, message, args) {
    if (!message.member.hasPermission('MANAGE_GUILD'))
      return message.channel.send(
        'Are you _trying_ to get yourself more work? Come on, dude, take a break!'
      );
    const { deadline } = /-d\s+"(?<deadline>.+?)"/.exec(message.content).groups;
    if (!deadline) return message.channel.send('Remind me when this is due again? (eg `-d "May 29, 2020"`)');

    const { course, name } = /-c\s+"(?<course>.+?)"\s+(?<name>.+)/.exec(
      message.content
    ).groups;
    if (!course) return message.channel.send('Wait, which class is this for? (eg `-c "CS 35"`)');
    if (!name) return message.channel.send('What\'s the assignment called? (eg `Exercise 3 -Pooches Pet Store`)');

    await new Assignment({ deadline, course, name }).save();
    return message.channel.send(
      'Alright, I\'ve just updated the stream with a new assignment.'
    );
  }
};