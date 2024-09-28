const express = require('express');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const unzipper = require('unzipper'); // Для распаковки архивов
const { exec } = require('child_process'); // Для выполнения команд в терминале

const router = express.Router(); // Экземпляр маршрутизатора

// Функция для получения данных о версии Minecraft
async function getMinecraftVersionData(versionId) {
    const versionManifestUrl = 'https://launchermeta.mojang.com/mc/game/version_manifest.json';
    const manifestResponse = await axios.get(versionManifestUrl);
    const versionData = manifestResponse.data.versions.find(v => v.id === versionId);

    if (!versionData) {
        throw new Error('Версия Minecraft не найдена');
    }

    const versionDetailResponse = await axios.get(versionData.url);
    return versionDetailResponse.data;
}

// Функция для скачивания файла по URL
async function downloadFile(url, outputPath) {
    const response = await axios({
        method: 'get',
        url,
        responseType: 'stream'
    });

    const writer = fs.createWriteStream(outputPath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
    });
}

// Установка и запуск Minecraft
router.post('/api/install/:version', async (req, res) => {
    const minecraftVersion = req.params.version;

    try {
        // Создаем директорию для сборки Minecraft
        const buildDir = path.join(__dirname, '../builds', minecraftVersion);
        if (!fs.existsSync(buildDir)) {
            fs.mkdirSync(buildDir, { recursive: true });
        }

        // Получаем данные о версии Minecraft
        const versionData = await getMinecraftVersionData(minecraftVersion);

        // Получаем URL клиента Minecraft (JAR-файл)
        const minecraftJarUrl = versionData.downloads.client.url;
        const jarPath = path.join(buildDir, `${minecraftVersion}.jar`);

        // Скачиваем jar-файл Minecraft
        await downloadFile(minecraftJarUrl, jarPath);
        console.log('Minecraft успешно скачан.');

        // Загружаем библиотеки и другие необходимые файлы
        const libraries = versionData.libraries;
        const librariesDir = path.join(buildDir, 'libraries');
        if (!fs.existsSync(librariesDir)) {
            fs.mkdirSync(librariesDir, { recursive: true });
        }

        // Скачивание библиотек (пример для одной библиотеки)
        for (const lib of libraries) {
            if (lib.downloads && lib.downloads.artifact) {
                const libUrl = lib.downloads.artifact.url;
                const libPath = path.join(librariesDir, path.basename(lib.downloads.artifact.path));
                await downloadFile(libUrl, libPath);
                console.log(`Библиотека ${lib.name} успешно скачана.`);
            }
        }

        // Запуск Minecraft
        exec(`java -jar "${jarPath}"`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Ошибка при запуске Minecraft: ${error.message}`);
                return res.status(500).json({ message: 'Ошибка при запуске Minecraft' });
            }
            console.log(`Minecraft успешно запущен: ${stdout}`);
            res.status(200).json({ message: 'Minecraft успешно установлен и запущен' });
        });

    } catch (error) {
        console.error('Ошибка при установке:', error);
        res.status(500).json({ message: 'Ошибка установки Minecraft' });
    }
});

module.exports = router;
