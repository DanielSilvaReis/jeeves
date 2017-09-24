const Discord = require("discord.js");
const bot = new Discord.Client();
const config = require("./config.json");
const dict = require("./dictionary.json")
var Twitter = require("twitter");
const fs = require('fs');

bot.on("ready", () => {
  console.log(dict.ready);
});

/**
 * How Jeeves should respond to messages
 */
bot.on("message", (message) => {
  if(message.content.startsWith(config.prefix) && isAllowed(1)) { // Commands
    handleCommands();
  } else if(message.content.toLowerCase().startsWith(config.title + " ") && isAllowed(0)) { // Games & Easter Eggs
    handleGames();
  }

  /**
   * Handles all normal commands
   */
  function handleCommands() { 
    const command = message.content.slice(config.prefix.length).trim().split(/ +/g).shift().toLowerCase();
    const args = message.content.slice(config.prefix.length + command.length).trim();
  
    // Commands handler
    if(dict.commands.greet.indexOf(command) >= 0) {
      handleGreetings();
    } else if (dict.commands.help.indexOf(command) >= 0) {
      handleHelp();
    } else if ((dict.commands.tweet.indexOf(command) >= 0) && isAllowed(2)) {
      handleAnnouncement();
    } else if ((dict.commands.toggleFreeMode[0] == command) && isAllowed(2)) {
      toggleFreeMode();
    } else if (dict.commands.displayRanks == command) {
      displayRanks();
    } else {
      message.channel.send(dict.commands.notFound)
      return;
    }

    //Logs activity
    var logResult = `[${new Date(message.createdTimestamp).toLocaleString()}] [#${message.channel.name}] ${message.member.displayName} : ${message.content}\r\n`;
    fs.appendFile("log.txt", logResult, "utf8", function(err) {
      if(err) {
          return console.log(err);
      }
    }); 

    /**
     * Displays all allowed roles and their ranks
     */
    function displayRanks() {
      message.channel.send(config.freeMode ? dict.freeMode.enabled : dict.freeMode.disabled);
      message.channel.send(dict.ranks.listRank2 + config.rank2.toString());
      message.channel.send(dict.ranks.listRank1 + config.rank1.toString());
    }

    /**
     * Handles TWEETS
     */
    function handleAnnouncement() {
      if(args.isEmpty()) {
        message.channel.send(dict.tweet.emptyError);
        return;
      }
  
      var twitterClient = new Twitter({
        consumer_key: config.twitter.consumer_key,
        consumer_secret: config.twitter.consumer_secret,
        access_token_key: config.twitter.access_token_key,
        access_token_secret: config.twitter.access_token_secret
      });
  
      twitterClient.post('statuses/update', { status: args })
        .then(function (response) {
          message.channel.send(dict.tweet.success);
        })
        .catch(function (error) {
          console.log(error);
          message.channel.send(dict.tweet.error);
        });
    }

    /**
     * Toggles the Free Mode
     */
    function toggleFreeMode() {
      if (args.toLowerCase() == dict.commands.toggleFreeMode[1]) { // ON
        config.freeMode = true;
      } else if (args.toLowerCase() == dict.commands.toggleFreeMode[2]) { // OFF
        config.freeMode = false;
      }
      message.channel.send(config.freeMode ? dict.freeMode.enabled : dict.freeMode.disabled);
    }
  }
  
  /**
   * Handles game commands
   */
  function handleGames() {
    const command = message.content.slice(config.title.length + " ").trim().split(/ +/g).shift().toLowerCase();
    
    // Commands handler
    if(dict.commands.greet.indexOf(command) >= 0) {
      handleGreetings();
    } else if (dict.commands.help.indexOf(command) >= 0) {
      handleHelp();
    } else {
      playMagic8Ball();
    }

    /**
     * Plays Magic 8 Ball
     */
    function playMagic8Ball() {
      var randomNumber = Math.floor(Math.random() * dict.magic8ball.length);
      message.channel.send("<@" + message.author.id + "> " + dict.magic8ball[randomNumber]);
    }
  }

  /**
   * The user gets greeted by Jeeves
   */
  function handleGreetings() {
    var randomNumber = Math.floor(Math.random()*dict.greetings.length);
    message.channel.send(dict.greetings[randomNumber].replace("{user}", "<@" + message.author.id + ">"));
  }

  /**
   * Displays all info & commands about Jeeves
   */
  function handleHelp() {
    message.channel.send("No help available yet!");
  }
  
  /**
   * Checks if the user is allowed to run a command
   * @param {Number} minRank - The minimum required rank
   */
  function isAllowed(minRank) {
    var allowedRoles = config.rank2.concat(config.rank1);
    switch(minRank) {
      case 0:
        if(message.member.roles.some(r=>allowedRoles.includes(r.name))) {
          return true;
        }
        return config.freeMode;
      case 1:
        return message.member.roles.some(r=>allowedRoles.includes(r.name));
      case 2:
        return message.member.roles.some(r=>config.rank2.includes(r.name));
      default:
        return false;
    }
  }
});

/**
 * Helper function: Checks if the string is empty!
 */
String.prototype.isEmpty = function() {
  return (this.length === 0 || !this.trim());
};

bot.login(config.token);
