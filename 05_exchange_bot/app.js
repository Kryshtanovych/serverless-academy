const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
const NodeCache = require("node-cache");

const bot = new TelegramBot("5947440666:AAGO1vC-xcfHapibsnCFZISj_GmFsXWUyMo", {
  polling: true,
});

const cache = new NodeCache({ stdTTL: 60 });

const privatBankUSDEndpoint =
  "https://api.privatbank.ua/p24api/pubinfo?exchange&json&coursid=11";

const privatBankEUREndpoint =
  "https://api.privatbank.ua/p24api/pubinfo?exchange&json&coursid=5";

const monoBankEndpoint = "https://api.monobank.ua/bank/currency";

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(
    chatId,
    "Welcome to the Exchange Rates Bot. Please choose an option:",
    {
      reply_markup: {
        keyboard: [["USD", "EUR"]],
      },
    }
  );
});

bot.onText(/USD/, (msg) => {
  const chatId = msg.chat.id;
  getUSDExchangeRate(chatId);
});

bot.onText(/EUR/, (msg) => {
  const chatId = msg.chat.id;
  getEURExchangeRate(chatId);
});

function getUSDExchangeRate(chatId) {
  const cacheKey = "usd_exchange_rate";

  const cachedData = cache.get(cacheKey);

  Promise.all([
    axios.get(privatBankUSDEndpoint),
    axios.get(monoBankEndpoint),
  ])
    .then((responses) => {
      const privatBankData = responses[0].data[0];
      const monoBankData = responses[1].data[0];

      const message = `PrivatBank USD Exchange Rate (Buy/Sell): ${privatBankData.buy}/${privatBankData.sale}\n` +
        `MonoBank USD Exchange Rate (Buy/Sell): ${monoBankData.rateBuy}/${monoBankData.rateSell}`;

      cache.set(cacheKey, message);
      bot.sendMessage(chatId, `USD Exchange Rate:\n${message}`);
    })
    .catch((error) => {
      if (cachedData) {
        bot.sendMessage(chatId, `USD Exchange Rate:\n${cachedData}`);
      } else {
        bot.sendMessage(
          chatId,
          "Sorry, an error occurred while fetching the exchange rate."
        );
        console.error(error);
      }
    });
}

function getEURExchangeRate(chatId) {
  const cacheKey = "eur_exchange_rate";

  const cachedData = cache.get(cacheKey);

  Promise.all([
    axios.get(privatBankEUREndpoint),
    axios.get(monoBankEndpoint),
  ])
    .then((responses) => {
      const privatBankData = responses[0].data[0];
      const monoBankData = responses[1].data[1];

      const message = `PrivatBank EUR Exchange Rate (Buy/Sell): ${privatBankData.buy}/${privatBankData.sale}\n` +
        `MonoBank EUR Exchange Rate (Buy/Sell): ${monoBankData.rateBuy}/${monoBankData.rateSell}`;

      cache.set(cacheKey, message);
      bot.sendMessage(chatId, `EUR Exchange Rate:\n${message}`);
    })
    .catch((error) => {
      if (cachedData) {
        bot.sendMessage(chatId, `EUR Exchange Rate:\n${cachedData}`);
      } else {
        bot.sendMessage(
          chatId,
          "Sorry, an error occurred while fetching the exchange rate."
        );
        console.error(error);
      }
    });
}
