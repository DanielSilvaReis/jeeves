# Jeeves
The perfect gentleman roboter, who will attend your needs!

## Configuration
Jeeves requires [Node.JS](https://nodejs.org/en/)! All packages can be installed with the command `npm install`!

To start Jeeves, you need to first create a `config.json` file in the `app/` folder. The `config.example.json` can be used! After the `config.json` is fully set, run Jeeves with: `npm start` !

### Properties
* **Token**: This is the token of the discord bot, where the app will connect to. See [this](https://discordapp.com/developers/applications/me)!
* **Prefix**: This is the prefix which can be used by ranked users to communicate with Jeeves.
* **Alloewd Roles**: This is an array of all roles who can access all commands.
* **Log**: You can toggle logging here. The logs will be saved in the `log.txt` file.
* **Twitter**: Register a Twitter App [here](https://apps.twitter.com) and insert all the keys in the fields. `Channels` is an array of all discord channel-id's, which will act as announcement channels!
* **Fun Channels**: Those are all channels where users with any role can use trivial commands.
* **Fun Servers**: Same as `Fun Channels`, but for servers.
* **Banned**: You can activate auto moderation here and set unmoderated channels as well as list all banned words.

## Commands & Features
Type `!help` in Discord to see all settings & commands. Jeeves is capable of *tweeting* posts and sharing tweets to all set announcements channels!

Bot activity can be logged if turned on. The bot can also moderate new messages if activated.

## License
This project is licensed under the MIT License — see the [LICENSE](./LICENSE) file for details!

[© Elysium Project](https://www.elysium-project.org)