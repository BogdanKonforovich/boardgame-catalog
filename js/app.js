// Масив ігор каталогу: назва та діапазон кількості гравців
const games = [
    { title: 'Шахи', minPlayers: 2, maxPlayers: 2 },
    { title: 'Монополія', minPlayers: 2, maxPlayers: 6 },
    { title: 'Дурень', minPlayers: 2, maxPlayers: 6 },
    { title: 'Морський бій', minPlayers: 2, maxPlayers: 2 },
    { title: 'Нарди', minPlayers: 2, maxPlayers: 2 },
    { title: 'Дженга', minPlayers: 2, maxPlayers: 8 },
    { title: 'Аліас', minPlayers: 4, maxPlayers: 8 },
    { title: 'Скрабл', minPlayers: 2, maxPlayers: 4 }
];

const listContainer = document.querySelector('#games-list');

const staticCards = document.querySelectorAll('#games-list .game');
staticCards.forEach(card => card.remove());

const gameDetails = {
    'Шахи': { description: 'Класична стратегічна гра для двох', img: 'assets/img/chess.webp' },
    'Монополія': { description: 'Економічна гра про скупівлю нерухомості', img: 'assets/img/monopoly.jpg' },
    'Дурень': { description: 'Популярна карткова гра на удачу й тактику', img: 'assets/img/fool.jpg' },
    'Морський бій': { description: 'Логічна гра на влучність і стратегію', img: 'assets/img/battleship.webp' },
    'Нарди': { description: 'Гра на кубиках і стратегічне мислення', img: 'assets/img/backgammon.png' },
    'Дженга': { description: 'Гра на спритність і стійку руку', img: 'assets/img/jenga.webp' },
    'Аліас': { description: 'Весела командна гра на пояснення слів', img: 'assets/img/alias.jpg' },
    'Скрабл': { description: 'Словесна гра на словниковий запас', img: 'assets/img/scrabble.jpg' }
};

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
        description.textContent = gameDetails[game.title].description;

        const img = document.createElement('img');
        img.src = gameDetails[game.title].img;
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