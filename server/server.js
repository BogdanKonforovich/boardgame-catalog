const express = require('express');
const games = require('./games.json');
const path = require('path');

const app = express();
const PORT = 3000;

const ROOT = path.join(__dirname, '..'); // корінь проєкту, де лежить index.html

// Список усіх ігор
app.get('/api/games', (req, res) => {
    res.json(games);
});

// Одна гра за id, або 404 з JSON-повідомленням
app.get('/api/games/:id', (req, res) => {
    const game = games.find((g) => String(g.id) === req.params.id);
    if (!game) {
        return res.status(404).json({ error: 'Гру не знайдено' });
    }
    res.json(game);
});

// Статичні файли клієнта: роздаємо лише потрібні теки,
// щоб не віддавати server.js і node_modules
app.use('/css', express.static(path.join(ROOT, 'css')));
app.use('/js', express.static(path.join(ROOT, 'js')));
app.use('/assets', express.static(path.join(ROOT, 'assets')));

app.get('/', (req, res) => {
    res.sendFile(path.join(ROOT, 'index.html'));
});

// Будь-який інший шлях під /api: 404 у форматі JSON
app.use('/api', (req, res) => {
    res.status(404).json({ error: 'Не знайдено' });
});

app.listen(PORT, () => console.log(`Сервер запущено на http://localhost:${PORT}`));
