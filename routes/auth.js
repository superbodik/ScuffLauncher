// routes/auth.js
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/user'); // Модель пользователя
const config = require('../config'); // Для использования SECRET_KEY из config

const router = express.Router();

// Регистрация пользователя
router.post('/register', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Проверка, существует ли уже пользователь
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Генерация UID
    const uid = uuidv4();

    // Хэширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    // Создание нового пользователя
    const newUser = new User({ username, password: hashedPassword, uid });
    await newUser.save();

    res.status(201).json({ message: 'User registered successfully', uid });
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
});

// Логин пользователя
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    // Поиск пользователя по имени
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Проверка пароля
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Генерация JWT токена
    const token = jwt.sign({ uid: user.uid }, config.secretKey, { expiresIn: '1h' });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
});

module.exports = router;
