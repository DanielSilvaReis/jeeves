require("../helper");
const dict = require("../dictionary");

/**
 * The user gets greeted by Jeeves
 */
module.exports = function(authorId) {
    var randomNumber = Math.floor(Math.random()*dict.greetings.length);
    sendMessage(dict.greetings[randomNumber].replace("{user}", "<@" + authorId + ">"));
}