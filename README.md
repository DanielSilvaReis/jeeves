# Jeeves
The perfect gentleman roboter, who will attend your needs!

## Configuration
Jeeves requires [Node.JS](https://nodejs.org/en/)! All packages can be installed with the command `npm install`!

To start Jeeves, you need to first create a `config.json` file in the `app/` folder. The `config.example.json` can be used! After the `config.json` is fully set, run Jeeves with: `npm start` !

### Properties
* **Token**: This is the token of the discord bot, where the app will connect to. See [this](https://discordapp.com/developers/applications/me)!
* **Prefix**: This is the prefix which can be used by ranked users to communicate with Jeeves.
* **Title**: Here you can set an alternative name of the bot.
* **Rank 2**: This is an array of all roles with *Rank 2* permissions.
* **Rank 1**: This is an array of all roles with *Rank 1* permissions.
* **Free Mode**: If this is toggled off, then only ranked users can communicate with Jeeves.
* **Log**: You can toggle logging here. The logs will be saved in the `log.txt` file.
* **Twitter**: Register a Twitter App [here](https://apps.twitter.com) and insert all the keys in the fields. `Channels` is an array of all discord channel-id's, which will act as announcement channels!

## Commands & Features
*(See `dictionary.json` for other possible keywords)*

If the `Free Mode` is turned **off**, only users with ranks can talk with Jeeves. When turned on, Jeeves will respond to everyone.
```
!freemode on
!freemode off
```
### Twitter
**`Requires Rank 2`**

Jeeves can quickly tweet and simultaneously share the tweets to all set channels.

#### Tweeting and sharing to all announcement channels
```
!ann Today was good day! :grin:
```
#### Sharing the latest tweet to all announcement channels
```
!ann get
```
### Games
**`No rank required`**

Users can play say hello or play `Magic 8 ball` with Jeeves.
```
Jeeves <any text>
Example: Jeeves Will I ever get R14?
```
User with ranks can instead of "Jeeves" (`title` property in the `config.json`) also use the set prefix:
```
!hi
```

### Display Settings
**`Requires Rank 1`**
Users can display all settings, like this:
```
!settings
```

### Logging
If turned on, all activity where the prefix is used will logged in a `log.txt` file!

## License
This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details!

[© Elysium Project](https://www.elysium-project.org)