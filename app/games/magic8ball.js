require("../main");
const dict = require("../dictionary");

/**
 * Plays Magic 8 Ball
 */
module.exports = function (authorId) {
    var randomNumber = Math.floor(Math.random() * dict.magic8ball.length);
    sendMessage("<@" + authorId + "> " + dict.magic8ball[randomNumber]);
}