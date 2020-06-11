const Discord = require('discord.js');
// This is an example of 
const { prefix, token } = require('./config.json');

const client = new Discord.Client();

// Intro to callbacks:
// Essentially what this code is doing is that once it receives
// the "ready" event, it will run the second argument passed, which *is* a function.
// Don't worry if this seems confusing — treating functions as first-class objects can be a tricky concept! We'll talk about it in one of our meetings.
client.once('ready', () => {
    console.log('Ready!');
});

// BIG BOY COMMAND STUFF
client.on('message', message => {
    // if the message does not start with a ";" 
    // or if the message was sent by the bot
    // we ignore it
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    // gets everything after the ";"
    // and splits off everything else into spaces
    //e .g. ;help one two => ["help", "one", "two"]
    // we use prefix.length because we might change the prefix (located in config.json) into something else
    const args = message.content.slice(prefix.length).split(/ +/);

    // Array.prototype.shift() pops off the first element of the array and returns it.
    // String.prototype.toLowerCase() makes the string all lowercase.
    const command = args.shift().toLowerCase();

    // there aren't many commands so I used an if/else statement, but there are better ways once your list of commands grows!
    if (command === 'goodmorning') {

        message.channel.send('Good morning Computer Science Students');

    } else if (command === 'picture') {

        // uploading a picture requires sending a more complicated message
        // this is called an "embed"
        let pictureEmbed =
            new Discord.MessageEmbed()
                .setTitle('Your Karas Picture for the day')
                .setImage('https://imgur.com/slphnBI.jpg');


        message.channel.send(pictureEmbed);

    } else if (command === 'help') {
        message.channel.send('Stop playing around with the bot and go code.');
    }
});

client.login(token);
