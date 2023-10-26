const TelegramBot = require('node-telegram-bot-api');
const program = require('commander');

const bot = new TelegramBot('BOT_TOKEN', { polling: true });

program
  .command('send-message <message>')
  .description('Send a message to Telegram bot')
  .action((message) => {
    bot.sendMessage(CHAT_ID, message);
  });

program
  .command('send-photo <path>')
  .description('Send a photo to Telegram bot')
  .action((path) => {
    bot.sendPhoto(CHAT_ID, { source: path });
  });

program.parse(process.argv);
