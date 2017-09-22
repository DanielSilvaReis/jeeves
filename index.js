const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");

var Twitter = require("twitter");

String.prototype.isEmpty = function() {
  return (this.length === 0 || !this.trim());
};

client.on("ready", () => {
  console.log("I am ready!");
});

client.on("message", (message) => {
  // Checks if the user is trying to communicate with Jeeves
  var len = 0;
  if(message.content.startsWith(config.prefix)) {
    len = config.prefix.length;
  } else if(message.content.toLowerCase().startsWith("jeeves ")) {
    len = "jeeves ".length;
  }
  if(len == 0) return;

  const split = message.content.slice(len).trim().split(/ +/g);
  const command = split.shift().toLowerCase();

  // Commands handler
  switch(command) {
    case "hi":
    case "hello":
    case "greetings":
    case "?":
    case "help":
    case "info":
      help();
      break;
    case "ann":
    case "announce":
    case "tweet":
      if(!allowed()) break;
      var tweet = message.content.slice(config.prefix.length + command.length).trim();
      if(tweet.isEmpty()) {
        message.channel.send("Cannot tweet nothing! :thinking:");
        break;
      }
      announce(tweet);
      break;
  }

  // Checks if the bot is allowed to communicate with the user
  function allowed() {
    if(message.member.roles.some(r=>config.allowedRoles.includes(r.name)) ) {
      return true;
    } else {
      message.channel.send("I am not allowed to talk to strangers! :confused:");
      return false;
    }
  }

  // Gets help
  function help() {
    var rnd = Math.floor((Math.random() * 10) + 1);
    if (rnd < 6) {
      message.channel.send("Greetings! I am Jeeves, a gentleman roboter and Community Manager, who will attend your needs! :grinning:");
    } else {
      message.channel.send("Good day, human! How may I be of assistance? :robot:");
    }
  }

  // Tweets a message. Example: Jeeves ann This is a tweet! :smile:
  function announce(tweet) {
    var twitterClient = new Twitter({
      consumer_key: config.twitter.consumer_key,
      consumer_secret: config.twitter.consumer_secret,
      access_token_key: config.twitter.access_token_key,
      access_token_secret: config.twitter.access_token_secret
    });

    twitterClient.post('statuses/update', {status: tweet})
      .then(function (response) {
        message.channel.send("Tweeting :bird:");
      })
      .catch(function (error) {
        console.log(error);
        message.channel.send("I couldn't tweet! :sob:");
      });
  }
});

client.login(config.token);