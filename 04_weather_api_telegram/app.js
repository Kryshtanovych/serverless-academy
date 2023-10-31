const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const bot = new TelegramBot('BOT_TOKEN', { polling: true });

const openWeatherMapEndpoint = 'https://api.openweathermap.org/data/2.5/forecast';
const openWeatherMapApiKey = 'API_KEY';

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Welcome to the Weather Forecast Bot. Please choose an option:', {
    reply_markup: {
      keyboard: [['Forecast in Nice']],
    },
  });
});

bot.onText(/Forecast in Nice/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Select the interval:', {
    reply_markup: {
      keyboard: [['3 hours', '6 hours']],
    },
  });
});

bot.onText(/3 hours/, (msg) => {
  const chatId = msg.chat.id;
  getWeatherForecast(chatId, 3);
});

bot.onText(/6 hours/, (msg) => {
  const chatId = msg.chat.id;
  getWeatherForecast(chatId, 6);
});

function getWeatherForecast(chatId, interval) {
  const city = 'Nice';
  axios
    .get(openWeatherMapEndpoint, {
      params: {
        q: city,
        appid: openWeatherMapApiKey,
      },
    })
    .then((response) => {
      const forecast = response.data.list.filter((item, index) => index % (interval / 3) === 0);
      const message = forecast.map((item) => {
        return `${new Date(item.dt * 1000)} - ${item.weather[0].description}`;
      }).join('\n');
      bot.sendMessage(chatId, `Weather forecast for ${city} at intervals of ${interval} hours:\n${message}`);
    })
    .catch((error) => {
      bot.sendMessage(chatId, 'Sorry, an error occurred while fetching the weather forecast.');
      console.error(error);
    });
}
