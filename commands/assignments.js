const Assignment = require("../models/Assignment.model");
const AssignmentModel = require("../models/Assignment.model");

module.exports = {
  async run(client, message, args) {
    if (args[0] === "add") {
      if (!message.member.hasPermission("MANAGE_GUILD"))
        return message.channel.send(
          "Are you _trying_ to get yourself more work? Come on, dude, take a break!"
        );
      const { course, name } = /-c\s+"(?<course>.+?)"\s+(?<name>.+)/.exec(
        message.content
      ).groups;

      await new Assignment({ course, name }).save();
      return message.channel.send(
        "Alright, I've just updated the stream with a new assignment."
      );
    }

    const role = message.member.roles.cache.find((role) =>
      role.name.startsWith("CS")
    );

    if (!role)
      return message.channel.send(
        "What are you doing... you aren't even in a course!"
      );

    const assignments = await Assignment.find({ course: role.name })
      .lean()
      .exec();
    message.channel.send(
      `Here's a list of your assignments:\n${assignments
        .map((asmt) => asmt.name)
        .join("\n")}`
    );
  },
};
