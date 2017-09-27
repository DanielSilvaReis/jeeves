const Discord = require("discord.js");
const bot = new Discord.Client();
const config = require("./config.json");
const dict = require("./dictionary.json")
const Twitter = require("twitter");
const fs = require('fs');
const dateFormat = require("dateformat");

process.title = "jeeves";

bot.on("ready", () => {
  logActivity(new Date(), "", "", "Jeeves", dict.ready);
});

/**
 * How Jeeves should respond to messages
 */
bot.on("message", (message) => {
  if (message.member == null) return;

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
    } else if (dict.commands.settings.indexOf(command) >= 0) {
      displaySettings();
    } else {
      sendMessage(dict.commands.notFound, false);
      return;
    }

    logActivity(new Date(message.createdTimestamp), message.channel.name, message.guild.name, message.member.displayName, message.content);

    /**
     * Displays all allowed roles and their ranks
     */
    function displaySettings() {
      sendMessage(
        {
          embed: {
            title: dict.settings.title,
            footer: {
              text: dict.copyright
            },
            fields: [
              {
                name: dict.settings.freeMode,
                value: config.freeMode ? dict.settings.enabled : dict.settings.disabled,
                inline: true
              },
              {
                name: dict.settings.log,
                value: config.log ? dict.settings.enabled : dict.settings.disabled,
                inline: true
              },
              {
                name: dict.settings.rank1,
                value: config.rank1.toString(),
                inline: true
              },
              {
                name: dict.settings.rank2,
                value: config.rank2.toString(),
                inline: true
              }
            ]
          }
        }
      );
    }

    /**
     * Handles TWEETS
     */
    function handleAnnouncement() {
      if(args.isEmpty()) {
        sendMessage(dict.tweet.emptyError);
        return;
      }

      var twitterClient = new Twitter({
        consumer_key: config.twitter.consumer_key,
        consumer_secret: config.twitter.consumer_secret,
        access_token_key: config.twitter.access_token_key,
        access_token_secret: config.twitter.access_token_secret
      });
  
      if (dict.tweet.getLatestArgs.indexOf(args.toLowerCase()) >= 0) {
        getLatestTweet(twitterClient);
      } else {
        postAnnouncement(twitterClient);
      }
    }

    /**
     * Gets the latest tweet from an account
     * @param {*} twitterClient 
     */
    function getLatestTweet(twitterClient) {
      twitterClient.get('statuses/user_timeline', { user_id : config.twitter.access_token_key.split("-").shift() })
      .then((result) => {
        sendMessage(`${dict.tweet.latestTweet}https://twitter.com/${result[0].user.screen_name}/status/${result[0].id_str}`);
        shareAnnouncement(result[0]);
      })
      .catch((errors) => handleTweetErrors(errors));
    }

    /**
     * Tweets a message
     * @param {*} twitterClient 
     */
    function postAnnouncement(twitterClient) {
      var formattedTweet = args.replace(" - ", " — ");

      twitterClient.post('statuses/update', { status: formattedTweet })
      .then((result) => {
        sendMessage(`${dict.tweet.success}https://twitter.com/${result.user.screen_name}/status/${result.id_str}`);
        shareAnnouncement(result);
      })
      .catch((errors) => handleTweetErrors(errors));
    }

    /**
     * Handles the Twitter API errors
     * @param {*} errors 
     */
    function handleTweetErrors(errors) {
      console.log(errors);
      errors.forEach((error) => {
        logActivity(new Date(), message.channel.name, message.guild.name, "ERROR", error.code + " — " + error.message);
      });
      sendMessage({
        content: dict.tweet.error,
        embed: {
          title: "Code(s) " + errors.map(error => error.code).toString(),
          footer: {
            text: dict.copyright
          },
          description: errors.map(error => error.message).toString()
        }
      }, true);
    }

    /**
     * Posts a tweet to all announcement channels
     * @param {*} response 
     */
    function shareAnnouncement(response) {
      config.twitter.channels.forEach((id) => {
        var channel = bot.channels.get(id);
        channel.send(dict.tweet.tag, { 
          embed: { 
            title : dateFormat(response.created_at, "mmmm dS, yyyy — HH:MM:ss"), 
            url : `https://twitter.com/${response.user.screen_name}/status/${response.id_str}`, 
            author : { 
              name : `Elysium Project (@${response.user.screen_name})`, 
              url : `https://twitter.com/${response.user.screen_name}}` 
            }, 
            description : response.text 
          } 
        }).catch((err) => {
          logActivity(new Date(), channel.name, channel.guild.name, "ERROR", err.message);
        });
      });
    }

    /**
     * Temporarily toggles the Free Mode
     */
    function toggleFreeMode() {
      if (args.toLowerCase() == dict.commands.toggleFreeMode[1]) { // ON
        config.freeMode = true;
      } else if (args.toLowerCase() == dict.commands.toggleFreeMode[2]) { // OFF
        config.freeMode = false;
      }
      sendMessage(config.freeMode ? dict.freeMode.enabled : dict.freeMode.disabled);
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
      sendMessage("<@" + message.author.id + "> " + dict.magic8ball[randomNumber]);
    }
  }

  /**
   * The user gets greeted by Jeeves
   */
  function handleGreetings() {
    var randomNumber = Math.floor(Math.random()*dict.greetings.length);
    sendMessage(dict.greetings[randomNumber].replace("{user}", "<@" + message.author.id + ">"));
  }

  /**
   * Displays all info & commands about Jeeves
   */
  function handleHelp() {
    sendMessage("No help available yet!");
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

  /**
   * Jeeves sends a message
   * @param {*} text 
   * @param {boolean} hasExtraContent 
   * @param {*} channel 
   */
  function sendMessage(text, hasExtraContent = false, channel = message.channel) {    
    message.channel.startTyping();
    if(hasExtraContent) {
      message.channel.send(text.content, text).catch((err) => catchError(err));
    } else {
      message.channel.send(text).catch((err) => catchError(err));
    }
    message.channel.stopTyping();

    function catchError(err) {
      logActivity(new Date(), message.channel.name, message.channel.guild.name, "ERROR", err.message);
    }
  }
});

/**
 * Helper function: Checks if the string is empty!
 */
String.prototype.isEmpty = function() {
  return (this.length === 0 || !this.trim());
};

/**
 * Logs activity
 * @param {Date} date 
 * @param {String} channel 
 * @param {String} server 
 * @param {String} displayName 
 * @param {String} text 
 */
function logActivity(date, channel, server, displayName, text) {
  var channelServer = channel.isEmpty() && server.isEmpty() ? "[BOT]" : `[#${channel} / ${server}]`;
  var logResult = `[${date.toLocaleString()}] ${channelServer} ${displayName} : ${text}`;

  console.log(logResult);
  
  if (!config.log) return; // Writing logs to file disabled

  fs.appendFile("log.txt", logResult + "\r\n", "utf8", function(err) {
    if(err) {
        return console.log(err);
    }
  });
}

bot.login(config.token);