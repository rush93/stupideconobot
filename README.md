# Stupid econobot
## Prerequisites

To get your bot to work, the following depencies will be required :
  - node v8
  - npm

## Installation
To configure and run you bot, you will need to:
  - Create app & bot discord: https://discordapp.com/developers/applications/me
  - Invite him to discord
  - Replace `BOT TOKEN` with your bot token int `token.js.dist`
  ```js
  var token = 'BOT TOKEN'

  module.exports = token;
``` 
  - Replace `API KEY` with your YouTube API key in  `youtubeApiKey.js.dist`
  ```js
  var youtubeApiKey = 'API KEY'

  module.exports = youtubeApiKey;
```
  - Install dependencies: `npm i`
  - And finally, run your bot with: `node stupid-econobot.js`
## Usage

In the commands bellow, `_` is your prefix and `<foo>` are command arguments.

To view all commands: `_help`.

If you want more informations about a command just type: `_help <command>` for more info .
