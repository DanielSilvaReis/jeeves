/**
 * Handles TWEETS
 */
module.exports.handleAnnouncement = (args) => {
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
module.exports.getLatestTweet = (twitterClient) => {
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
module.exports.postAnnouncement = (twitterClient) => {
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
module.exports.handleTweetErrors = (errors) => {
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
module.exports.shareAnnouncement = (response) => {
    config.twitter.channels.forEach((id) => {
        var channel = bot.channels.get(id);
        channel.send(dict.tweet.tag, { 
        embed: { 
            title : dateFormat(response.created_at, "mmmm dS, yyyy — HH:MM"), 
            url : `https://twitter.com/${response.user.screen_name}/status/${response.id_str}`, 
            footer: {
                text: dict.copyright
            },
            author : { 
                name : `Elysium Project (@${response.user.screen_name})`, 
                url : `https://twitter.com/${response.user.screen_name}` 
            }, 
            description : response.text 
        } 
        }).catch((err) => {
            logActivity(new Date(), channel.name, channel.guild.name, "ERROR", err.message);
        });
    });
}