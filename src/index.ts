import env from 'dotenv';
import Discord from 'discord.js';
import winston from 'winston';

env.config();

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: '/tmp/log/minerva/discord-bot.log', level: 'info' })
    ]
});

const client = new Discord.Client();

client.on('ready', () => {
    logger.info(`Bot Logged in!`);
    sendMessage(client);
});

const sendMessage = (client: any) => {
    client.channels.cache.get(process.env.DISCORD_ANNOUNCEMENT_CHANNEL_ID).send('Howdy!');
}

client.login(process.env.BOT_TOKEN);
