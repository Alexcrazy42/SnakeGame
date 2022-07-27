var canvas = document.getElementById('game');
// Классическая змейка — двухмерная, сделаем такую же
var context = canvas.getContext('2d');
// Размер одной клеточки на поле — 16 пикселей
var grid = 16;

document.getElementById("count").innerHTML = 0;
document.getElementById("best_count").innerHTML = 0;
var best_count = 0;
var count = 0;

// А вот и сама змейка
var snake = {
    x: 160,
    y: 160,
    dx: grid,
    dy: 0,
    cells: [],
    maxCells: 4,
};

var apple = {
    x: 320,
    y: 320
};

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
// Игровой цикл — основной процесс, внутри которого будет всё происходить
function loop() {
    // Хитрая функция, которая замедляет скорость игры с 60 кадров в секунду до 15 (60/15 = 4)
    requestAnimationFrame(loop);
    // Игровой код выполнится только один раз из четырёх, в этом и суть замедления кадров, а пока переменная count меньше четырёх, код выполняться не будет
    if (++count < 4) {
        return;
    }
    // Обнуляем переменную скорости
    count = 0;
    // Очищаем игровое поле
    context.clearRect(0, 0, canvas.width, canvas.height);
    // Двигаем змейку с нужной скоростью
    snake.x += snake.dx;
    snake.y += snake.dy;
    // Если змейка достигла края поля по горизонтали — продолжаем её движение с противоположной строны
    if (snake.x < 0) {
        snake.x = 160;
        snake.y = 160;
        snake.cells = [];
        snake.maxCells = 4;
        snake.dx = grid;
        snake.dy = 0;
        // Ставим яблочко в случайное место
        apple.x = getRandomInt(0, 25) * grid;
        apple.y = getRandomInt(0, 25) * grid;
    } else if (snake.x >= canvas.width) {
        snake.x = 160;
        snake.y = 160;
        snake.cells = [];
        snake.maxCells = 4;
        snake.dx = grid;
        snake.dy = 0;
        // Ставим яблочко в случайное место
        apple.x = getRandomInt(0, 25) * grid;
        apple.y = getRandomInt(0, 25) * grid;
    }
    // Делаем то же самое для движения по вертикали
    if (snake.y < 0) {
        snake.x = 160;
        snake.y = 160;
        snake.cells = [];
        snake.maxCells = 4;
        snake.dx = grid;
        snake.dy = 0;
        // Ставим яблочко в случайное место
        apple.x = getRandomInt(0, 25) * grid;
        apple.y = getRandomInt(0, 25) * grid;
    } else if (snake.y >= canvas.height) {
        snake.x = 160;
        snake.y = 160;
        snake.cells = [];
        snake.maxCells = 4;
        snake.dx = grid;
        snake.dy = 0;
        // Ставим яблочко в случайное место
        apple.x = getRandomInt(0, 25) * grid;
        apple.y = getRandomInt(0, 25) * grid;
    }
    // Продолжаем двигаться в выбранном направлении. Голова всегда впереди, поэтому добавляем её координаты в начало массива, который отвечает за всю змейку
    snake.cells.unshift({ x: snake.x, y: snake.y });
    // Сразу после этого удаляем последний элемент из массива змейки, потому что она движется и постоянно освобождает клетки после себя
    if (snake.cells.length > snake.maxCells) {
        snake.cells.pop();
    }
    // Рисуем еду — красное яблоко
    context.fillStyle = 'red';

    context.fillRect(apple.x, apple.y, grid - 2, grid - 2);
    // Одно движение змейки — один новый нарисованный квадратик 
    context.fillStyle = 'green';
    // Обрабатываем каждый элемент змейки
    snake.cells.forEach(function(cell, index) {
        // Чтобы создать эффект клеточек, делаем зелёные квадратики меньше на один пиксель, чтобы вокруг них образовалась чёрная граница
        context.fillRect(cell.x, cell.y, grid - 1, grid - 1);
        // Если змейка добралась до яблока...
        if (cell.x === apple.x && cell.y === apple.y) {
            // увеличиваем длину змейки
            snake.maxCells++;
            document.getElementById("count").innerHTML = snake.maxCells - 4;
            if (snake.maxCells - 4 >= best_count) {
                document.getElementById("best_count").innerHTML = snake.maxCells - 4;
                best_count = document.getElementById("count").innerHTML;
            }

            // Рисуем новое яблочко
            // Помним, что размер холста у нас 400x400, при этом он разбит на ячейки — 25 в каждую сторону
            apple.x = getRandomInt(0, 25) * grid;
            apple.y = getRandomInt(0, 25) * grid;
        }
        // Проверяем, не столкнулась ли змея сама с собой
        // Для этого перебираем весь массив и смотрим, есть ли у нас в массиве змейки две клетки с одинаковыми координатами 
        for (var i = index + 1; i < snake.cells.length; i++) {
            // Если такие клетки есть — начинаем игру заново
            if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
                // Задаём стартовые параметры основным переменным

                snake.x = 160;
                snake.y = 160;
                snake.cells = [];
                snake.maxCells = 4;
                snake.dx = grid;
                snake.dy = 0;
                // Ставим яблочко в случайное место
                apple.x = getRandomInt(0, 25) * grid;
                apple.y = getRandomInt(0, 25) * grid;
            }
        }
    });
}
// Смотрим, какие нажимаются клавиши, и реагируем на них нужным образом
document.addEventListener('keydown', function(e) {
    // Дополнительно проверяем такой момент: если змейка движется, например, влево, то ещё одно нажатие влево или вправо ничего не поменяет — змейка продолжит двигаться в ту же сторону, что и раньше. Это сделано для того, чтобы не разворачивать весь массив со змейкой на лету и не усложнять код игры.
    // Стрелка влево
    // Если нажата стрелка влево, и при этом змейка никуда не движется по горизонтали…
    if (e.which === 37 && snake.dx === 0) {
        // то даём ей движение по горизонтали, влево, а вертикальное — останавливаем
        // Та же самая логика будет и в остальных кнопках
        snake.dx = -grid;
        snake.dy = 0;
    }
    // Стрелка вверх
    else if (e.which === 38 && snake.dy === 0) {
        snake.dy = -grid;
        snake.dx = 0;
    }
    // Стрелка вправо
    else if (e.which === 39 && snake.dx === 0) {
        snake.dx = grid;
        snake.dy = 0;
    }
    // Стрелка вниз
    else if (e.which === 40 && snake.dy === 0) {
        snake.dy = grid;
        snake.dx = 0;
    }
});

requestAnimationFrame(loop);