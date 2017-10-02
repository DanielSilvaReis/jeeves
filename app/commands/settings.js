require("../helper");
const dict = require("../dictionary");

/**
 * Displays all allowed roles and their ranks
 */
module.exports = function() {
    sendMessage({
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
    });
}