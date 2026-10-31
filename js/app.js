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
    props: ['title', 'description', 'minPlayers', 'maxPlayers', 'genreLabel', 'genre', 'img'],
    emits: ['filter'],
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
        vueGames: [
            { id: 1, title: 'Шахи', description: 'Класична стратегічна гра для двох', minPlayers: 2, maxPlayers: 2, genre: 'strategic', img: 'assets/img/chess.webp' },
            { id: 2, title: 'Монополія', description: 'Економічна гра про скупівлю нерухомості', minPlayers: 2, maxPlayers: 6, genre: 'economic', img: 'assets/img/monopoly.jpg' },
            { id: 3, title: 'Дурень', description: 'Популярна карткова гра на удачу й тактику', minPlayers: 2, maxPlayers: 6, genre: 'card_based', img: 'assets/img/fool.jpg' },
            { id: 4, title: 'Морський бій', description: 'Логічна гра на влучність і стратегію', minPlayers: 2, maxPlayers: 2, genre: 'logic_puzzles', img: 'assets/img/battleship.webp' },
            { id: 5, title: 'Нарди', description: 'Гра на кубиках і стратегічне мислення', minPlayers: 2, maxPlayers: 2, genre: 'strategic', img: 'assets/img/backgammon.png' },
            { id: 6, title: 'Дженга', description: 'Гра на спритність і стійку руку', minPlayers: 2, maxPlayers: 8, genre: 'logic_puzzles', img: 'assets/img/jenga.webp' },
            { id: 7, title: 'Аліас', description: 'Весела командна гра на пояснення слів', minPlayers: 4, maxPlayers: 8, genre: 'strategic', img: 'assets/img/alias.jpg' },
            { id: 8, title: 'Скрабл', description: 'Словесна гра на словниковий запас', minPlayers: 2, maxPlayers: 4, genre: 'logic_puzzles', img: 'assets/img/scrabble.jpg' }
        ],
            activeGenre: null,
            checkedPlayers: []
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
form.addEventListener('submit', (event) => {
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
    
    vueApp.vueGames.push({
    id: vueApp.vueGames.length + 1,
    title: newElement.title,
    minPlayers: newElement.minPlayers,
    maxPlayers: newElement.maxPlayers,
    description: newElement.description,
    genre: newElement.genre,
    img: newElement.img || 'assets/img/placeholder.jpg'
    });

    form.reset();
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