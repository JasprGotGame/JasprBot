const Discord = require('discord.js');
const client = new Discord.Client();
const settings = require('./settings.json');
const YTDL = require('ytdl-core');

var servers = {};
var prefix = "~!"

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
      case 'money':
        message.channel.send('https://kjyourway.com/');
        break;
      case 'ping':
        message.channel.send(`🏓 Pong! \`${Date.now() - message.createdTimestamp} ms\``);
        break;
      case 'help':
        message.channel.send('For a list of commands type ~commands or contact an Admin');
        break;
      case "commands":
        message.channel.send("```\n~!jasprbot -get to know me\n~!help     -get help\n~!commands -see a list of commands\n~!money    -need money on GTA 5?\n~!ping     -see bots response time to server\n~!discord  -join the discord\n~!play YoutubeLinkHere - puts bot in voice channel you are in and plays the song from the link provided\n~!skip - skips the song that is currently playing\n~!end - ends all songs in queue```");
        break;
      case 'setgame':
        client.user.setGame(argresult);
        break;
      case 'discord':
        var embed = new Discord.RichEmbed()
          .addField('Modding | GTA5 | Community', 'https://discord.gg/2D6pQH3')
          .setColor('#49ECA6')
        message.channel.sendEmbed(embed);
        break;
      case 'jasprbot':
        message.channel.send('Hi! Im JasprBot! I was built to make your experience here the best it could possibly be! If you need more help type "~help" Thank you for using JasprBot! Hope to hear from you soon!<3 ');
        break;
      case 'play':
        if (!args[0]) {
          message.channel.send('please provide a link ');
          return;
        }
        if (!message.member.voiceChannel) {
          message.channel.send('You Need to be In A Voice Channel to Do This! ');
          return;
        }
        if (!servers[message.guild.id]) servers[message.guild.id] = {
          queue: []
        }

        var server = servers[message.guild.id];
        server.queue.push(args[0]);

        if (!message.guild.voiceConnection) message.member.voiceChannel.join().then(function(connection) {
          play(connection, message);
        });

        break;
      case "skip":
        var server = servers[message.guild.id];
        if (server.dispatcher) server.dispatcher.end();

        break;
      case "end":
        var server = servers[message.guild.id];
        if (message.guild.voiceConnection) message.guild.voiceConnection.disconnect();

        break;





    }


});
client.login(settings.token);
