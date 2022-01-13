import env from 'dotenv';
import Discord from 'discord.js';
import winston from 'winston';
import Sanity from '@sanity/client';

env.config();

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: '/tmp/log/minerva/discord-bot.log', level: 'info' })
    ]
});

const discordClient = new Discord.Client();
const sanityClient = Sanity({
    projectId: process.env.SANITY_PROJECT_ID,
    dataset: process.env.SANITY_DATASET,
    apiVersion: process.env.SANITY_VERSION,
    token: process.env.SANITY_TOKEN,
    useCdn: false
});

discordClient.on('ready', () => {
    logger.info(`Bot Logged in!`);
    const query: string = '*[_type == "post"]'
    sanityClient.listen(query).subscribe((update) => {
        const message: string = buildAnnouncement(update);
        sendMessage(discordClient, message);
    });
});

const sendMessage = (discordClient: any, message: string) => {
    discordClient.channels.cache.get(process.env.DISCORD_ANNOUNCEMENT_CHANNEL_ID).send(message);
}

const buildAnnouncement = (postData: any) : string => {
    const postType: string = postData.transition
    const type: string = postType === 'update' ? 'updated' : "posted"
    const message: string = 'Hey @everyone, an article was just just ' + type + ' on the blog: ' + postData.result.title + '! Go check it out!'

    return message
}

discordClient.login(process.env.BOT_TOKEN);
