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

printGamesForPlayers(games, 4);

// Перевіряє, чи задана кількість гравців підходить для конкретної гри
const fitsPlayers = (game, n) => n >= game.minPlayers && n <= game.maxPlayers;

console.log(fitsPlayers(games[1], 1));

console.log(fitsPlayers(games[3], 2));