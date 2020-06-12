const Assignment = require('../../models/Assignment.model');

module.exports = {
  async run(client, message, args) {
    console.log(message.content);
    const {asmtName} = /-n\s+"(?<asmtName>[\s\S]+?)"/.exec(message.content).groups;
    console.log(asmtName);
    const asmt = await Assignment.findOne({ name: asmtName }).exec();
    console.log(asmt);

    const {deadline} = /-d\s+"(?<deadline>.+?)"/.exec(message.content).groups;
    console.log({ deadline });
    if (deadline) asmt.deadline = new Date(deadline);
    await asmt.save();
    message.channel.send('Alright, now go get \'er done!');
  }
};