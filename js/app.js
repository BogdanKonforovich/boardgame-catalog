// Масив ігор каталогу: назва та діапазон кількості гравців і жанр
const games = [
    { title: 'Шахи', minPlayers: 2, maxPlayers: 2, genre: 'strategic', description: 'Класична стратегічна гра для двох', img: 'assets/img/chess.webp' },
    { title: 'Монополія', minPlayers: 2, maxPlayers: 6, genre: 'economic', description: 'Економічна гра про скупівлю нерухомості', img: 'assets/img/monopoly.jpg' },
    { title: 'Дурень', minPlayers: 2, maxPlayers: 6, genre: 'card_based', description: 'Популярна карткова гра на удачу й тактику', img: 'assets/img/fool.jpg' },
    { title: 'Морський бій', minPlayers: 2, maxPlayers: 2, genre: 'logic_puzzles', description: 'Логічна гра на влучність і стратегію', img: 'assets/img/battleship.webp' },
    { title: 'Нарди', minPlayers: 2, maxPlayers: 2, genre: 'strategic', description: 'Гра на кубиках і стратегічне мислення', img: 'assets/img/backgammon.png' },
    { title: 'Дженга', minPlayers: 2, maxPlayers: 8, genre: 'games_of_chance', description: 'Гра на спритність і стійку руку', img: 'assets/img/jenga.webp' },
    { title: 'Аліас', minPlayers: 4, maxPlayers: 8, genre: 'card_based', description: 'Весела командна гра на пояснення слів', img: 'assets/img/alias.jpg' },
    { title: 'Скрабл', minPlayers: 2, maxPlayers: 4, genre: 'card_based', description: 'Словесна гра на словниковий запас', img: 'assets/img/scrabble.jpg' }
];

const listContainer = document.querySelector('#games-list');

const staticCards = document.querySelectorAll('#games-list .game');
staticCards.forEach(card => card.remove());

// Рендерить список карток ігор на основі масиву games,
// для кожної гри створює article з h3 (назва), p (опис), img (зображення) та span (бейдж гравців),
// додає атрибут data-players і клас fits (якщо гра підходить для 4 гравців), і вставляє картку в контейнер

function renderGames(gamesList)
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

        const img = document.createElement('img');
        img.src = game.img;
        img.alt = game.title;

        const badge = document.createElement('span');
        badge.classList.add('players-badge');
        badge.textContent = formatPlayers(game);
        
        card.dataset.players = game.maxPlayers;
        if(fitsPlayers(game, 4))
        {
            card.classList.add('fits')
        }

        card.append(title, description, img, badge);

        listContainer.append(card);
    }
}

function formatPlayers(game) {
    if (game.minPlayers === game.maxPlayers) {
        return game.minPlayers + ' гравці';
    } else {
        return game.minPlayers + '-' + game.maxPlayers + ' гравців';
    }
}

// Виводить у консоль назви ігор, які підходять для заданої кількості гравців
function printGamesForPlayers(gamesList, playerCount)
{
    console.log(`Для ${playerCount} гравців підходять такі ігри:`)
    for(const game of gamesList)
    {
        if(playerCount >= game.minPlayers && playerCount <= game.maxPlayers)
        {
            console.log(game.title);
        }
    }
}

// Перевіряє, чи задана кількість гравців підходить для конкретної гри
const fitsPlayers = (game, n) => n >= game.minPlayers && n <= game.maxPlayers;

renderGames(games);

// Оновлюємо підсумковий лічильник кількості ігор
const gamesCount = document.querySelector('#games-count');
gamesCount.textContent = 'Усього ігор у каталозі: ' + games.length;

// Обробник надсилання форми додавання нової гри:
// зчитує значення полів, перевіряє коректність діапазону гравців (minPlayers ≤ maxPlayers),
// додає нову гру в масив games і перемальовує список карток
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

    listContainer.innerHTML = '';
    games.push(newElement);

    renderGames(games);
    gamesCount.textContent = 'Усього ігор у каталозі: ' + games.length;
    form.reset();
});

// Обробник надсилання форми фільтрів (кнопка "Застосувати"):
// збирає позначені чекбокси "Кількість гравців", фільтрує масив games через fitsPlayers
// і перемальовує список, показуючи лише ігри, що підходять під хоча б одне обране значення

const filtersForm = document.querySelector('#filters-form');
const playerCountCheckboxes = document.querySelectorAll('.player-count')

filtersForm.addEventListener('submit', (event) =>{
    event.preventDefault();

    const checkValue = [];

    for(const c of playerCountCheckboxes)
    {
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

    const filterGame = [];

    for(const game of games)
    {
        let flag = false;
        for(const n of checkValue)
        {
            if(fitsPlayers(game, n)){
                flag = true;
            }
        }

        if(flag)
        {
            filterGame.push(game);
        }
    }

    listContainer.innerHTML = '';

    renderGames(filterGame);
    gamesCount.textContent = 'Усього ігор у каталозі: ' + filterGame.length;
}) 
