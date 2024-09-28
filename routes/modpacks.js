const express = require('express');
const multer = require('multer');
const Modpack = require('../models/modpack');
const cors = require('cors');
const router = express.Router();

// Настройки для хранения файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Обработчик для получения всех модпаков
router.get('/', async (req, res) => {
  try {
    const modpacks = await Modpack.find();
    res.json(modpacks);
  } catch (error) {
    console.error('Ошибка при получении модпаков:', error);
    res.status(500).json({ message: 'Ошибка при получении модпаков' });
  }
});

// Обработчик для загрузки модпака
router.post('/', upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'file', maxCount: 1 }
]), async (req, res) => {
  console.log('Request body:', req.body);
  console.log('Uploaded files:', req.files);

  if (!req.body.version || !req.body.modloader) {
    return res.status(400).json({ message: 'Version and modloader are required' });
  }

  try {
    const baseUrl = req.protocol + '://' + req.get('host');
    const modpack = new Modpack({
      name: req.body.name,
      description: req.body.description,
      modloader: req.body.modloader,
      version: req.body.version,
      image: req.files.image ? `${baseUrl}/uploads/${req.files.image[0].filename}` : null,
      file: req.files.file ? `${baseUrl}/uploads/${req.files.file[0].filename}` : null
    });

    const savedModpack = await modpack.save();
    res.status(201).json({ message: 'Modpack uploaded successfully', modpack: savedModpack });
  } catch (error) {
    console.error('Ошибка при загрузке модпака:', error);
    res.status(400).json({ message: 'Ошибка при загрузке модпака', error });
  }
});

module.exports = router;
