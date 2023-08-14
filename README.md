# A Simple, Highly customizable Discord Moderation Multi-Purpose Bot




## Pre-requisities

- [NodeJS v18.8.0](https://nodejs.org/en/download) or above is required
- NPM v9.7.1 (shipped with NodeJS)

## Installing Dependencies

To install all the dependencies run `npm install` in your Terminal in the bot's directory.

## Setting up your bot

Head over to the [Discord Devlopper Portal](https://discord.com/developers/applications) login into your account, click on "Applications" then "New Application" and enter the desired name of your bot. Next click on your new application and go to "Bot" upload an image (optional) and set your bot's name. You will then select the **SERVER MEMBER INTENT**, this is very important for the bot to function correctly. Finnally, go to "OAuth" then "URL Generator" and tick the following boxes: "bot" & "application.commands" then below select "Administrator" (if you don't want to select the Administrator permission then select "View Messages", "Kick Members", "Ban Members", "View audit Log", "Read Messages", "Moderate Members", "Send Messages", "Embed Links", "Read Message History", "Mention Everyone", "Use External Emojis, "Add Reactions", "Mute Members", "Deafen Members")

It should then generate a link at the bottom of the page, take this link and copy it into your browser to add your bot to your server.

After adding your bot, locate a file named `.env` in the bot's files. There should be a few empty fields in which you need to specify your "Bot Token" (found under the bot tabs in the devlopper portal) and the "Client ID/Application ID" found in the general informations tab. 
Both of these strings of numbers & letters need to be pasted in that `.env` file or the bot simply won't be able to start-up.
*Warning! Modifying other variables may break the bot, only change them if you know what you're doing.*

Once all of the fields have been filled, open a new terminal window and run the following command `npm run deploy` this will add the slash-commands to your discord server. Once the script ends you may start the bot using `npm run start`.


