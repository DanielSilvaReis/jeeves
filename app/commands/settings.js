require("../main");
const dict = require("../dictionary");

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

/**
 * Displays all allowed roles and their ranks
 */
module.exports.display = (authorId) => {
    sendMessage({
        content : "<@" + authorId + ">",
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
    }, true);
}

module.exports.toggleFiltering = () => {
    console.log("toggle filtering");
}

module.exports.toggleGameMode = () => {
    console.log("toggle filtering");
}