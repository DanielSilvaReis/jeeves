require("./helper");
const config = require("./config");

process.title = "jeeves";
bot.on("ready", () => {
    logActivity(new Date(), "", "", "Jeeves", dict.ready);
});

bot.on("message", (message) => {
    if (message.member == null) return;

    var prefix = "";
    
    if(message.content.startsWith(message.config.prefix)) {
        prefix = config.prefix;
    } else if(message.content.toLowerCase().startsWith(message.config.title + " ")) {
        prefix = config.title;
    } else {
        return; // Prefix not detected
    }

    var command = content.trim().split(/ +/g).shift().toLowerCase();
    var args = content.slice(command.length).trim();
});

bot.login(config.token);