const Discord = require("discord.js");
const TOKEN = require("./../config.json");
const bot = new Discord.Client();
const ytdl = require("ytdl-core", "ffmpeg-binaries"); // for the youtube links to be converted to audio
let servers = {};

bot.once("ready", () => {
  console.log("Ready Song");
});

bot.login(TOKEN.token); // logs in with the token

// TODO: Errors on commands other than play when hasnt connected to voice channel yet

// This function is provoced when !play is commanded and the bot will play a youtube link in the voice channel
bot.on("message", (message) => {
  if (message.author.bot) return;
  let args = message.content.substring(TOKEN.prefix.length).split(" ");
  if (message.content.indexOf(TOKEN.prefix) !== 0) return;

  switch (args[0]) {
    case "play":
      // Check if youtube link
      if (!message.content.includes("youtube.com/watch?v=")) {
        message.channel.send(
          "Please enter a valid youtube link to play a song."
        );
        return;
      }
      // Check in voice channel
      if (!message.member.voice.channel) {
        message.channel.send(
          "You must be in a voice channel to request a song."
        );
        return;
      }

      // Check to see if link was provided
      if (!args[1]) {
        message.channel.send(
          "You need to provide a link for me to play a song."
        );
        return;
      }

      // Creates Queue
      if (!servers[message.guild.id])
        servers[message.guild.id] = {
          queue: [],
        };

      // Cycles song through queue
      // When reaching the end of queue needs !reset command for the moment
      function play(connection, message) {
        if (!server.queue[1]) {
          server.dispatcher = connection.play(
            ytdl(server.queue[0], { filter: "audioonly" })
          );
        }
        server.dispatcher.on("finish", function () {
          server.queue.shift();
          if (server.queue[0]) play(connection, message);
          else {
            server.queue.push(args[1]);
            server.queue.shift();
          }
        });
      }

      var server = servers[message.guild.id];

      // Pushes the requested song to the queue
      server.queue.push(args[1]);

      //If not in voice channel, join then play the song
      if (!message.member.voice.connection)
        message.member.voice.channel.join().then(function (connection) {
          play(connection, message);
        });
      break;

    // Other commands
    // Pauses music
    case "pause":
      var server = servers[message.guild.id];
      if (server.dispatcher) server.dispatcher.pause();
      message.channel.send("Pausing the song.");
      break;

    // Resumes music
    case "resume":
      var server = servers[message.guild.id];
      if (server.dispatcher) server.dispatcher.resume();
      message.channel.send("Resuming the song.");
      break;

    // Skips the current song
    case "skip":
      var server = servers[message.guild.id];
      if (server.dispatcher) server.dispatcher.end();
      message.channel.send("Skipping the current song.");
      break;

    // Resets the queue so the bot can play music after reaching end of queue
    case "reset":
      var server = servers[message.guild.id];
      if (message.guild.voice.connection) {
        server.queue = [];
        server.dispatcher.end();
      }
      message.channel.send("Queue was reset.");

      break;

    // Stops music and makes bot leave voice
    case "stop":
      var server = servers[message.guild.id];
      if (message.guild.voice.connection) {
        server.queue = [];
        server.dispatcher.end();
        message.guild.voice.connection.disconnect();
        message.channel.send("Stopping the music.");
      }
      break;
  }
});
