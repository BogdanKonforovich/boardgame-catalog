///11///

const STORAGE_KEY = 'games';

function saveToLocalStorage(items){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function loadFromLocalStorage(){
    try{
        const data = localStorage.getItem(STORAGE_KEY);
        if(data)
        {
            return JSON.parse(data);
        }
        return [];
    }
    catch (error) {
        console.error('Помилка при завантаженні даних з localStorage:', error);
        return [];
    }
}

// Схема: база BoardGamesDB, версія 1, один object store "games" з ключем id
const DB_NAME = 'BoardGamesDB';
const DB_VERSION = 1;
const STORE_NAME = 'games';

// Відкриває базу даних. При першому запуску створює сховище games з ключем id
function openDB() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id' });
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

// Додає нову гру або оновлює наявну з тим самим id (put)
async function addItem(item){
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        tx.objectStore(STORE_NAME).put({ ...item });
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
}

// Видаляє гру за id
async function deleteItem(item){
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readwrite');
        tx.objectStore(STORE_NAME).delete(item.id);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
}

// Повертає масив усіх ігор зі сховища
async function getAllItems(){
    const db = await openDB();
    return new Promise((resolve, reject) => {
        const tx = db.transaction(STORE_NAME, 'readonly');
        const request = tx.objectStore(STORE_NAME).getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

const MIGRATED_KEY = 'migrated';

async function migrateFromLocalStorage() {
    if (localStorage.getItem(MIGRATED_KEY) === 'true') {
        return;
    }

    const existing = await getAllItems();
    const raw = localStorage.getItem(STORAGE_KEY);

    if (existing.length === 0) {
        const source = raw !== null ? loadFromLocalStorage() : defaultGames;
        for (const game of source) {
            await addItem(game);
        }
        console.log(`Ініціалізація: записано ${source.length} ігор в IndexedDB`);
    }

    localStorage.setItem(MIGRATED_KEY, 'true');
}

const defaultGames = [
    { id: 1, title: 'Шахи', description: 'Класична стратегічна гра для двох', minPlayers: 2, maxPlayers: 2, genre: 'strategic', img: 'assets/img/chess.webp', played: false },
    { id: 2, title: 'Монополія', description: 'Економічна гра про скупівлю нерухомості', minPlayers: 2, maxPlayers: 6, genre: 'economic', img: 'assets/img/monopoly.jpg', played: false },
    { id: 3, title: 'Дурень', description: 'Популярна карткова гра на удачу й тактику', minPlayers: 2, maxPlayers: 6, genre: 'card_based', img: 'assets/img/fool.jpg', played: false },
    { id: 4, title: 'Морський бій', description: 'Логічна гра на влучність і стратегію', minPlayers: 2, maxPlayers: 2, genre: 'logic_puzzles', img: 'assets/img/battleship.webp', played: false },
    { id: 5, title: 'Нарди', description: 'Гра на кубиках і стратегічне мислення', minPlayers: 2, maxPlayers: 2, genre: 'strategic', img: 'assets/img/backgammon.png', played: false },
    { id: 6, title: 'Дженга', description: 'Гра на спритність і стійку руку', minPlayers: 2, maxPlayers: 8, genre: 'logic_puzzles', img: 'assets/img/jenga.webp', played: false },
    { id: 7, title: 'Аліас', description: 'Весела командна гра на пояснення слів', minPlayers: 4, maxPlayers: 8, genre: 'strategic', img: 'assets/img/alias.jpg', played: false },
    { id: 8, title: 'Скрабл', description: 'Словесна гра на словниковий запас', minPlayers: 2, maxPlayers: 4, genre: 'logic_puzzles', img: 'assets/img/scrabble.jpg', played: false },
];

function getInitialGames(){
    const saved = loadFromLocalStorage();
    if(saved.length > 0)
    {
        return saved;
    }

    return structuredClone(defaultGames);
}


// Обрано Vue 3 (підключення через CDN, без збірки/Node.js).
// Причина: шаблони Vue (v-for, @click) схожі на звичайний HTML і легші для розуміння
// на старті, ніж JSX у React — не треба вчити новий синтаксис усередині JS.
const genreLabels = {
    strategic: 'Стратегія',
    logic_puzzles: 'Логічні головоломки',
    card_based: 'Карткові',
    games_of_chance: 'Ігри на удачу',
    economic: 'Економічні'
};

const GameCard = 
{
    props: ['gameId', 'title', 'description', 'minPlayers', 'maxPlayers', 'genreLabel', 'genre', 'img', 'played'],
    emits: ['filter', 'toggle-played'],
    computed: {
        playersText() {
            if (this.minPlayers === this.maxPlayers) 
                {
                return `${this.minPlayers} гравці`;
            }
            return `${this.minPlayers}–${this.maxPlayers} гравців`;
        }
    },
    template: `
        <article class="game">
            <h3>{{ title }}</h3>
            <p class="game-description">{{ description }}</p>
            <img :src="img" :alt="title">
            <label>
                <input type="checkbox" :checked="played" @change="$emit('toggle-played', gameId)">
                Зіграно
            </label>
            <div class="badges">
                <span class="players-badge">{{ playersText }}</span>
                <span class="players-badge genre-badge" @click="$emit('filter', genre)">
                    {{ genreLabel }}
                </span>
            </div>
        </article>
    `
}


const {createApp} = Vue;

const vueApp = createApp({
    components: {GameCard},
    data() {
        return {
        genreLabels,
        vueGames: [],
        dbError: '',
        activeGenre: null,
        checkedPlayers: []
        }
    },
    async mounted() {
    try {
        await migrateFromLocalStorage();
        this.vueGames = await getAllItems();
    } catch (error) {
        console.error('IndexedDB недоступна:', error);
        this.dbError = 'Не вдалося відкрити базу даних. Зміни не будуть збережені.';
    }
    },
    computed: 
    {
        filteredGames() 
        {
            let result = this.vueGames;

            if (this.activeGenre) {
                result = result.filter(g => g.genre === this.activeGenre);
            }

            if (this.checkedPlayers.length > 0) {
                result = result.filter(game =>
                    this.checkedPlayers.some(n => n >= game.minPlayers && n <= game.maxPlayers)
                );
            }

            return result;
        }
    },
    methods: {
        filterByGenre(genre) {
            this.activeGenre = genre;
        },
        clearFilter() {
            this.activeGenre = null;
        },
        setPlayersFilter(values) {
            this.checkedPlayers = values;
        },
        async togglePlayed(id){
            const game = this.vueGames.find(g => g.id === id);
            if (!game) return;
            game.played = !game.played;
            try {
                await addItem(game);
            } catch (error) {
                game.played = !game.played;
                console.error('Помилка збереження:', error);
                this.dbError = 'Не вдалося зберегти зміни.';
            }
        }
    }
}).mount('#vue-app');


// Рендерить список карток для блоку "Зіграні ігри" (дані з API, практикум 9):
// для кожного запису створює article з h3 (назва) і p (опис/статус), вставляє в контейнер.
// Примітка (практикум 10): renderGames лишається лише для цього блоку API;
// основний каталог ігор тепер повністю рендерить Vue-компонент GameCard (v-for, без querySelector/innerHTML)

function renderGames(gamesList, container)
{
    for(let game of gamesList)
    {
        const card = document.createElement('article');
        card.classList.add('game');

        const title = document.createElement('h3');
        title.textContent = game.title;

        const description = document.createElement('p');
        description.classList.add('game-description');
        description.textContent = game.description;
        
        card.append(title, description);
        container.append(card);
    }
}

// Обробник форми додавання нової гри:
// зчитує поля, перевіряє, що minPlayers ≤ maxPlayers, і додає гру в реактивний
// масив vueGames; Vue сам перемальовує каталог (ручний рендер не потрібен)
const form = document.querySelector('#game-form');
form.addEventListener('submit', async  (event) => {
    event.preventDefault();

    const title = document.querySelector('#game-title').value.trim();
    const min = Number(document.querySelector('#game-min-players').value);
    const max = Number(document.querySelector('#game-max-players').value);
    const genre = document.querySelector('#game-genre').value;
    const description = document.querySelector('#game-description').value.trim() || "Опис відсутній";
    const img = document.querySelector('#game-img').value.trim()

    const newElement = 
    {
        title: title,
        minPlayers: min,
        maxPlayers: max,
        genre: genre,
        description: description,
        img: img
    }

    const errorElement = document.querySelector('#game-form-error');

    if(min > max)
    {
        errorElement.textContent = 'Мінімальна кількість гравців не може перевищувати максимальну';
        return;
    }
    else
    {
        errorElement.textContent = '';
    }
    
    const newId = Math.max(0, ...vueApp.vueGames.map(g => g.id));

    const newGame = {
        id: newId + 1,
        title: newElement.title,
        minPlayers: newElement.minPlayers,
        maxPlayers: newElement.maxPlayers,
        description: newElement.description,
        genre: newElement.genre,
        img: newElement.img || 'assets/img/placeholder.jpg',
        played: false
    };

    try {
        await addItem(newGame);
        vueApp.vueGames.push(newGame);
        form.reset();
    } catch (error) {
        console.error('Помилка збереження:', error);
        vueApp.dbError = 'Не вдалося зберегти гру.';
    }
});

// Обробник форми фільтрів (кнопка "Застосувати"):
// збирає позначені чекбокси "Кількість гравців" і передає їх у Vue через
// setPlayersFilter; обчислюване значення filteredGames перераховується само

const filtersForm = document.querySelector('#filters-form');
const playerAll = document.querySelector('#player-all');
const playerCountCheckboxes = document.querySelectorAll('.player-count')

const anyPlayerChecked = () => [...playerCountCheckboxes].some(c => c.checked);

playerAll.addEventListener('change', () => {
    if (playerAll.checked) {
        playerCountCheckboxes.forEach(c => c.checked = false);
    } else if (!anyPlayerChecked()) {
        playerAll.checked = true;
    }
});

playerCountCheckboxes.forEach(c => {

    c.addEventListener('change', () => {
        
        if (c.checked) {
            playerAll.checked = false;
        } else if (!anyPlayerChecked()) {
            playerAll.checked = true;
        }
    });
});

filtersForm.addEventListener('submit', (event) =>{
    event.preventDefault();

    const checkValue = [];

    for(const c of playerCountCheckboxes)
    {
        if(!playerAll.checked){
            if(c.checked)
            {
                if(c.id === '6plus')
                {
                    checkValue.push(6);
                }
                else
                {
                    checkValue.push(Number(c.id));
                }
            }
        }
    }

    vueApp.setPlayersFilter(checkValue);
}) 


// loadData() завантажує список зіграних ігор з JSONPlaceholder (мок-дані todos):
// https://jsonplaceholder.typicode.com/todos?userId=1
// Показує стан завантаження, перевіряє response.ok, розбирає JSON і виводить картки;
// у разі помилки показує зрозуміле повідомлення користувачу, а деталі пише в консоль

const API_URL = 'https://jsonplaceholder.typicode.com/todos?userId=1';

async function loadData() {

    const loadingElement = document.querySelector('#todos-loading');
    const errorElement = document.querySelector('#todos-error');
    const refreshBtn = document.querySelector('#todos-refresh');

    loadingElement.hidden = false;
    errorElement.textContent = '';
    refreshBtn.disabled = true;

    try
    {
        const response = await fetch(API_URL);
        if(!response.ok)
        {
            throw new Error('Помилка HTTP: ' + response.status);
        }

        const data = await response.json();
        console.log('Отримані дані з API:', data);

        renderTodos(data);
    }
    catch (error)
    {
        errorElement.textContent = 'Не вдалося завантажити список зіграних ігор. Спробуйте пізніше.';
        console.error('Помилка при завантаженні даних:', error);
    }
    finally
    {
        loadingElement.hidden = true;
        refreshBtn.disabled = false;
    }
}

// Виводить дані з API у секцію "Список зіграних ігор":
// очищає контейнер #todos-list, перетворює поля todo (title, completed)
// на об'єкти гри (title, description) і передає їх у renderGames
function renderTodos(todoList) 
{
    const todosContainer = document.querySelector('#todos-list');
    todosContainer.innerHTML = '';

    const adapted = [];
    for (const todo of todoList) {
        adapted.push({
            title: todo.title,
            description: todo.completed ? 'Зіграно' : 'Не зіграно'
        });
    }
    renderGames(adapted, todosContainer);
}

loadData();

document.querySelector('#todos-refresh').addEventListener('click', loadData);