const express = require('express');
const path = require('path');
const router = express.Router();

// Обработчик для отображения страницы загрузки
router.get('/upload', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/upload.html')); 
});

router.get('/auth/register', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/register.html'));
});

router.get('/auth/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/login.html'));
});

module.exports = router;
