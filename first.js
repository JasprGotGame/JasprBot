const Discord = require('discord.js');
const client = new Discord.Client();
const settings = require('./settings.json');
const YTDL = require('ytdl-core');

var servers = {};
var prefix = "~"

// join leave log
client.on('guildMemberAdd', (member) => {
  var channel = ' ';
  member.guild.channels.map(chan => {
    channel = chan;
    if (chan.id === '278686585736658957') {
      channel.send(`Welcome to The Society/kjyourway.com ${member.user} for more events stay tuned! Remember to invite your friends`);
    }
  });
});
client.on('guildMemberRemove', (member) => {
  var channel = ' ';
  member.guild.channels.map(chan => {
    channel = chan;
    if (chan.id === '278686585736658957') {
      channel.send(` ${member.user} has left/been removed from The Society. Bye Bye!`);
    }
  });
});
// client.on('guildBanAdd', (guild, user) => {
//     var channel = ' ';
//     guild.channels.map(chan => {
//         channel = chan;
//         if (chan.id === '278686585736658957') {
//            channel.send(` ${user.user} has just been hit with the ban hammer! Bye Bye!`);
//         }
//     });
// });
// end join leave log

// client.on messages
client.on("message", message => {
  if (message.author.bot) {
    return;
  }
  let args = message.content.split(' ').slice(1);

  var argresult = args.join(' ');
  let command = message.content.split(" ")[0].replace(/\n/g, " ").substring(prefix.length).toLowerCase();
  if (!message.content.startsWith(prefix)) return;

  if (command)
    switch (command) {
      case 'your case':
        message.channel.send("This could be anything");
        break;
    }

  if (message.content.startsWith(prefix + 'help')) {
      message.channel.send("For a list of commands type ~commands or contact ${216285835878727680}");
    } else
  if (message.content.startsWith(prefix + 'money')) {
    message.channel.send('https://kjyourway.com/');
  } else
  if (message.content.startsWith(prefix + 'ping')) {
    // message.channel.send("Pong!");
    message.channel.send(`Pong! \`${Date.now() - message.createdTimestamp} ms\``);
  }
  // end client.on messages



  // set game
  var commands = message.content.split(" ")[0].replace(/\n/g, " ").substring(prefix.length).toLowerCase();
  let argument = message.content.split(' ').slice(1);
  if (command === 'setgame') {
    if (argument) {
      var game = ' ';
      for (var i = 0; i < argument.length; i++) {
        game += argument[i] + ' ';
      }
      client.user.setGame(game);
    } else {
      message.reply('Invalid use of command setgame, I need an argument.');
    }
  }
});

// start music bot
function play(connection, message) {
  var server = servers[message.guild.id];

  server.dispatcher = connection.playStream(YTDL(server.queue[0], {
    filter: "audioonly"
  }));
  server.queue.shift();

  server.dispatcher.on("end", function() {
    if (server.queue[0]) play(connection, message);
    else connection.disconnect();
  });
}

switch (args[0].toLowerCase()) {
  case "play":
    if (!args[1]) {
      message.channel.sendMessage("Please Provide a Link");
      return;
    }

    if (message.member.voiceChannel) {
      message.channel.sendMessage("Your Not In a Voice Channel! Please Join One!");
      return;
    }
    if (!servers[message.guild.id]) servers[message.guild.id] = {
      queue: []
    }
    var server = servers[message.guild.id];
    server.queue.push(args[1]);
    if (!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection) {
      play(connection, message);
    });


    break;
  case "skip":
    var server = servers[message.guild.id];
    if (server.dispatcher) server.dispatcher.end();
    break;
  case "stop":
    var server = servers[message.guild.id];

    if (message.guild.voiceConnection) message.guild.voiceConnection.disconnect();
    break;
}

// end music bot

// end set game

client.login(settings.token);
