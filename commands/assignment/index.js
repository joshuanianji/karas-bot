const { Collection } = require('discord.js');
const Assignment = require('../../models/Assignment.model');
const addCommand = require('./add');
const updateCommand = require('./update');

const fmtDate = (d) => `${d.toLocaleString('default', { month: 'short'})} ${d.getDate()}, ${d.getFullYear()}`;

module.exports = {
  name: 'assignment',
  usage: '__assignment__',
  description: 'Need some help with your assignments? List \'em out first! If you need extra help just let me know.',
  subcommands: new Collection([
    ['add', addCommand],
    ['update', updateCommand]
  ]),
  async run(client, message, args) {
    if (args._[0] === 'add') return addCommand.run(client, message, {...args, _: args._.slice(1)});
    if (args._[0] === 'update') return updateCommand.run(client, message, {...args, _: args._.slice(1)});

    const role = message.member.roles.cache.find(role =>role.name.startsWith('CS'));

    if (!role)
      return message.channel.send(
        'What are you doing... you aren\'t even in a course!'
      );

    const assignments = await Assignment.find({ course: role.name })
      .lean()
      .exec();

    message.channel.send(
      `Here's a list of your assignments:\n${assignments
        .sort((a, b) => a.deadline - b.deadline)
        .map((asmt) => `**${asmt.name}**${asmt.deadline ? ` — Due ${fmtDate(asmt.deadline)}` : ''}`)
        .join('\n')}`
    );
  },
};
