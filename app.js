require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const cors = require('cors');

const { errors } = require('celebrate');
const limiter = require('./middlewares/rateLimit');
const errorHendler = require('./middlewares/errorHendler');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const routes = require('./routes/index');

const { PORT = 3000, MONGO_URI = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;
const mongoConfig = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

const app = express();
app.use(cors());

app.use(limiter);

app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger); // подключаем логгер запросов
app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});
app.use('/', routes);
app.use(errorLogger); // подключаем логгер ошибок

app.use(errors());
app.use(errorHendler);

function main() {
  mongoose
    .connect(MONGO_URI, mongoConfig)
    .then(() => {
      console.log('Подключение к MongoDB выполнено');
      app.listen(PORT, () => {
        console.log(`Приложение слушает порт ${PORT}!`);
      });
    })
    .catch((err) => {
      console.log(`Ошибка подключения к MongoDB: ${err}`);
    });
}

main();
