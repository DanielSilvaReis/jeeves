const Discord = require("discord.js");
const bot = new Discord.Client();

require("./main");
const config = require("./config");
const dict = require("./dictionary");

const settings = require("./commands/settings");

process.title = "jeeves";
bot.on("ready", () => {
    logActivity(new Date(), "", "", "Jeeves", dict.ready);
});

bot.on("message", (message) => {
    if (message.member == null) return;

    if (config.banned.active && 
        config.banned.unmoderatedChannels.indexOf(message.channel.id) == 0 && 
        new RegExp(config.banned.words.join("|")).test(message.content.toLowerCase())) {
        //TODO: Delete banned words & notify user
        return;
    }

    var prefix = "";
    
    if(message.content.startsWith(message.config.prefix)) {
        prefix = config.prefix;
    } else if(message.content.toLowerCase().startsWith("<@" + config.botId + "> ")) {
        prefix = "<@" + config.botId + ">";
    } else {
        return; // Prefix not detected
    }

    var command = content.slice(prefix.length).trim().split(/ +/g).shift().toLowerCase();
    var args = content.slice(prefix.length + command.length).trim();

    // Commands handler
    if((dict.commands.greet.indexOf(command) >= 0) && isAllowed(0)) {
        require("./commands/greet")(message.author.id);
    } else if ((dict.commands.help.indexOf(command) >= 0) && isAllowed(0)) {
        require("./commands/help")(message.author.id);
    } else if ((dict.commands.tweet.indexOf(command) >= 0) && isAllowed(2)) {
    } else if ((dict.commands.toggleFreeMode[0] == command) && isAllowed(2)) {
    } else if ((dict.commands.settings.indexOf(command) >= 0) && isAllowed(0)) {
    } else if ((dict.commands.fidgetSpinner.indexOf(command)) >= 0 && isAllowed(0)) {
    } else if ((dict.commands.fortune.indexOf(command) >= 0) && isAllowed(0)) {
    } else if ((dict.commands.settings.indexOf(command) >= 0) && isAllowed(1)) {
        settings.display(message.author.id);
    } else if ((dict.commands.ask.indexOf(command) >= 0) && isAllowed(0)) {
        require("./games/magic8ball")(message.author.id);
    }
});

bot.login(config.token);