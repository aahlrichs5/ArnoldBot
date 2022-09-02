# ArnoldBot

This is my first discord bot. The purpose of this bot is to get a better understanding
of the capabilities of JS. Another purpose is to have an auto-moderator filter through
chat messages when I am offline. The bot is currently a work in progress and I am still
adding new features that will be listed here when complete. The bot is currently not hosted on a server but is only available when run locally. It is not intended for public use but a brief setup is listed below if you would like to attempt to run the bot yourself.

# Commands:

`/help` states commands to be entered by users <br />
`/hello` the bot gives a greeting message <br />
`/gif { keyword }` the bot replies with a random gif form the given keyword <br />
`/user` gives some information about the user's discord account <br />

# Automatic Functions:

LanguageFilter: filters through a list of words that are banned and removes the message

- List is configurable by creating `message-check.json` within the root folder and defining `badWords` and `bannedWords` arrays

# Requirements and Setup

Requirements

1. Use latest version of `Node.js`
2. Create a discord bot account and save the token
3. Create tenor developer account and save the API key
4. Create Riot developer account and save the API key

Setup

1. Run `npm install` to install the needed packages
2. Rename `example-config.json` to `config.json` file to root foler
3. Edit values in `config.json` with your keys and tokens
4. Rename `example-message-check.json` to `message-check.json`
5. Edit values in `message-check.json` to the values that you would like to check for or words you would like moderated
6. Run `npm run start` to start the bot. Console will log when specific functionality is ready to be used
