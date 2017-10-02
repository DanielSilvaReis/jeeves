const config = require("./config");

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

/**
 * Jeeves sends a message
 * @param {*} text 
 * @param {boolean} hasExtraContent 
 * @param {*} channel 
 */
function sendMessage(text, hasExtraContent = false, channel = message.channel) {    
    channel.startTyping();
    if(hasExtraContent) {
        channel.send(text.content, text).catch((err) => catchError(err));
    } else {
        channel.send(text).catch((err) => catchError(err));
    }
    channel.stopTyping();

    function catchError(err) {
        logActivity(new Date(), channel.name, channel.guild.name, "ERROR", err.message);
    }
}

/**
 * Checks if the user is allowed to run a command
 * @param {Number} minRank - The minimum required rank
 * @param {*} member - The minimum required rank
 */
function isAllowed(minRank, member) {
    var allowedRoles = config.rank2.concat(config.rank1);
    switch(minRank) {
        case 0:
            if(member.roles.some(r=>allowedRoles.includes(r.name))) {
                return true;
            }
            return config.freeMode;
        case 1:
            return member.roles.some(r=>allowedRoles.includes(r.name));
        case 2:
            return member.roles.some(r=>config.rank2.includes(r.name));
        default:
            return false;
    }
}