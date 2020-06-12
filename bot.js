require('dotenv').config();
const assert = require('assert');
const fs = require('fs');
const Discord = require('discord.js');
const mongoose = require('mongoose');
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
    console.log(client.commands);

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
  const args = message.content.slice(prefix.length).split(/\s+/);
  
  // Array.prototype.shift() pops off the first element of the array and returns it.
  // String.prototype.toLowerCase() makes the string all lowercase.
  const command = args.shift().toLowerCase();
  if (!client.commands.has(command)) return;
  client.commands.get(command).run(client, message, args);
});

client.on('guildMemberAdd', (member) => {
  // TODO
});

client.login(token);
