const Discord = require("discord.js");
const TOKEN = require("./../config.json");
const bot = new Discord.Client();
const ytdl = require("ytdl-core", "ffmpeg-binaries"); // for the youtube links to be converted to audio
let servers = [];

bot.once("ready", () => {
  console.log("Ready Song");
});

bot.login(TOKEN.token); // logs in with the token

// This function is provoced when !play is commanded and the bot will play a youtube link in the voice channel
bot.on("message", (message) => {
  let args = message.content.substring(TOKEN.prefix.length).split(" ");

  switch (args[0]) {
    case "play":
      function play(connection, message) {
        let server = servers[message.guild.id];

        server.dispatcher = connection.play(
          ytdl(server.queue[0], { filter: "audioonly" })
        );

        server.queue.shift();
        server.dispatcher.on("end", function () {
          if (server.queue[0]) play(connection, message);
          else connection.disconnect();
        });
      }

      if (!args[1]) {
        message.channel.send(
          "You need to provide a link for me to play a song."
        );
        return;
      }
      if (!message.member.voice.channel) {
        message.channel.send(
          "You must be in a voice channel to request a song."
        );
        return;
      }

      if (!servers[message.guild.id]) {
        servers[message.guild.id] = {
          queue: [],
        };
      }
      let server = servers[message.guild.id];

      server.queue.push(args[1]);

      if (!message.member.voice.connection)
        message.member.voice.channel.join().then(function (connection) {
          play(connection, message);
        });
      break;
  }
});
