const Assignment = require('../../models/Assignment.model');
const addCommand = require('./add');
const updateCommand = require('./update');

const fmtDate = (d) => `${d.toLocaleString('default', { month: 'short'})} ${d.getDate()}, ${d.getFullYear()}`;

module.exports = {
  usage: 'assignment',
  help: 'Show a list of your assignments',
  async run(client, message, args) {
    if (args[0] === 'add') return addCommand.run(client, message, args);
    if (args[0] === 'update') return updateCommand.run(client, message, args);

    console.log('assignments');

    const role = message.member.roles.cache.find(role =>role.name.startsWith('CS'));

    if (!role)
      return message.channel.send(
        'What are you doing... you aren\'t even in a course!'
      );

    const assignments = await Assignment.find({ course: role.name })
      .lean()
      .exec();

    console.log(assignments);

    message.channel.send(
      `Here's a list of your assignments:\n${assignments
        .sort((a, b) => a.deadline - b.deadline)
        .map((asmt) => `**${asmt.name}**${asmt.deadline ? ` — Due ${fmtDate(asmt.deadline)}` : ''}`)
        .join('\n')}`
    );
  },
};
