require("../main");
const dict = require("../dictionary");

/**
 * The user gets greeted by Jeeves
 */
module.exports = (authorId) => {
    var randomNumber = Math.floor(Math.random()*dict.greetings.length);
    sendMessage(dict.greetings[randomNumber].replace("{user}", "<@" + authorId + ">"));
}