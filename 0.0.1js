const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const winston = require('winston');
const cors = require('cors');

const modpacksRouter = require('./routes/modpacks'); 
const authRoutes = require('./routes/auth');
const indexRoutes = require('./routes/index');
const installRoutes = require('./routes/installRoutes');
const config = require('./config');


const app = express();


app.use('/auth', authRoutes);
app.use('/', indexRoutes);
app.use('/api/modpacks', modpacksRouter);
app.use('/api/install', installRoutes);

const corsOptions = {
  origin: 'http://127.0.0.1:5500',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
};


app.use(cors(corsOptions));


const logDir = 'logs';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}]: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: path.join(logDir, 'server.log') })
  ],
});


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Content Security Policy
app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "default-src 'self'; img-src 'self' data:; script-src 'self';");
  next();
});

// Логирование запросов
app.use((req, res, next) => {
  logger.info(`HTTP ${req.method} ${req.url}`);
  next();
});

// Подключение к MongoDB
mongoose.connect(config.mongoURI, {})
  .then(() => {
    logger.info('Connected to MongoDB');
  })
  .catch(err => {
    logger.error('Error connecting to MongoDB: ', err);
  });

// Включение отладки MongoDB
mongoose.set('debug', (collectionName, method, query, doc) => {
  logger.info(`MongoDB Query: ${collectionName}.${method} ${JSON.stringify(query)} ${doc ? JSON.stringify(doc) : ''}`);
});




app.use((err, req, res, next) => {
  logger.error(`Error occurred: ${err.message}`);
  res.status(err.status || 500).json({ message: err.message || 'Server error' });
});

app.listen(config.port, () => {
  logger.info(`Server running on http://localhost:${config.port}`);
});
