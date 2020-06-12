require('dotenv').config();
const assert = require('assert');
const fs = require('fs');
const Discord = require('discord.js');
const mongoose = require('mongoose');
const yargs = require('yargs-parser');

const config = fs.existsSync('./config.json') ? require('./config.json') : {};
const token = process.env.TOKEN || config.token;
assert(token, 'You must configure the bot with a token!');

const prefix = process.env.PREFIX || config.prefix || ';';

const client = new Discord.Client();
client.commands = new Discord.Collection();

// Intro to callbacks:
// Essentially what this code is doing is that once it receives
// the "ready" event, it will run the second argument passed, which *is* a function.
// Don't worry if this seems confusing — treating functions as first-class objects can be a tricky concept! We'll talk about it in one of our meetings.
client.once('ready', () => {
  fs.readdir('./commands', (err, files) => {
    files
      .filter(file => file.endsWith('.js') || fs.existsSync(`./commands/${file}/index.js`))
      .forEach((file) => {
        const cmdName = file.endsWith('.js') ? file.slice(0, -3) : file;
        client.commands.set(cmdName, require(`./commands/${file}`));
      });
    console.log('loaded these commands:', client.commands.keyArray().join(', '));
  });

  mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
    if (err) {
      console.log('Error connecting to the database: ', err);
      process.exit(1);
    }
    console.log('connected to the database!');
  });
});

// BIG BOY COMMAND STUFF
client.on('message', (message) => {
  // if the message does not start with a ";" 
  // or if the message was sent by the bot
  // we ignore it
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  // gets everything after the prefix and splits off everything else into spaces
  //e .g. ;help one two => ["help", "one", "two"]
  // we use prefix.length because we might change the prefix (located in config.json)
  // into something else
  // Then, we split it based on whitespace characters using a regular expression
  const args = yargs(message.content.slice(prefix.length));

  // Array.prototype.shift() pops off the first element of the array and returns it.
  // String.prototype.toLowerCase() makes the string all lowercase.
  const command = args._.shift().toLowerCase();
  if (!client.commands.has(command)) return;
  client.commands.get(command).run(client, message, args);
});

// sends a DM to a user when they join the server
client.on('guildMemberAdd', async (member) => {
  const karasImg = 'https://i.imgur.com/slphnBI.jpg';
  const osacsLogo = 'https://i.imgur.com/S4inqe1.png';

  member.createDM()
    .then((DMCHannel) => {
      embedMsg = new Discord.MessageEmbed()
        .setTitle(`OSACS Discord`)
        .setURL('https://discord.gg/j6uRkC')
        .setDescription(`We're glad you decided to join us in your programming journey, ${member.user.username}`)
        .setThumbnail(osacsLogo)

      DMCHannel.send(embedMsg);
      DMCHannel.send("**Please read and respect the rules written in `#README` channel**, and if you have any questions, feel free to message anyone with the `exec` role. Failing to follow the rules can result in a ban - or even a harsh word from me!");
      DMCHannel.send("I am an omnipotent deity: the digital incarnation of Mr. Karas, the Computer Science teacher at OSA. I'm still a work in progress, and if you have any suggestions for things I can do, we would **love** to hear your thoughts in the `#suggestions` channel. And if you want to make your own Discord bot, we'd love that as well! There is an `OSACS Certified Bots` role just for this kind of thing. Happy coding!");

      console.log(`Successfully sent welcome message to: ${member.user.username}`)
    })
    .catch((error) =>
      console.log(`Error sending message to ${member.user.username}! `, error))
})

client.login(token);
