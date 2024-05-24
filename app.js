document.addEventListener('DOMContentLoaded', () => {
    const btn = document.querySelector('#restart');
    const win = document.querySelector('.win');
    const gameOver = document.querySelector('.gameOver');
    const grid = document.querySelector('.grid');
    const resultDisplay = document.querySelector('#result');
    let width = 24; // Novo valor da largura
    let height = 17; // Novo valor da altura
    let totalSquares = width * height;
    let currentShooterIndex = totalSquares - Math.floor(width / 2) - 1;
    let currentInvaderIndex = 0;
    let alienInvadersTakenDown = [];
    let result = 0;
    let direction = 1;
    let invaderId;


    // Criar a grade dinamicamente
    for (let i = 0; i < totalSquares; i++) {
        const square = document.createElement('div');
        grid.appendChild(square);
    }

    const squares = Array.from(document.querySelectorAll('.grid div'));

    // Definir os invasores
    const alienInvaders = [
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16,
        width, width + 1, width + 2, width + 3, width + 4, width + 5, width + 6, width + 7, width + 8, width + 9, width + 10, width + 11, width + 12, width + 13, width + 14, width + 15, width + 16,
        2 * width, 2 * width + 1, 2 * width + 2, 2 * width + 3, 2 * width + 4, 2 * width + 5, 2 * width + 6, 2 * width + 7, 2 * width + 8, 2 * width + 9, 2 * width + 10, 2 * width + 11, 2 * width + 12, 2 * width + 13, 2 * width + 14, 2 * width + 15, 2 * width + 16
    ];

    // Desenhar os invasores
    alienInvaders.forEach(invader => squares[currentInvaderIndex + invader].classList.add('invader'));

    // Desenhar o principal (nave do jogador)
    squares[currentShooterIndex].classList.add('shooter');

    // Mover a nave do jogador na linha
    function moveShooter(e) {
        squares[currentShooterIndex].classList.remove('shooter');
        switch (e.keyCode) {
            case 37: // Tecla esquerda
                if (currentShooterIndex % width !== 0) currentShooterIndex -= 1;
                break;
            case 39: // Tecla direita
                if (currentShooterIndex % width < width - 1) currentShooterIndex += 1;
                break;
        }
        squares[currentShooterIndex].classList.add('shooter');
    }
    document.addEventListener('keydown', moveShooter);

    // Mover invasores
    function moveInvaders() {
        const leftEdge = alienInvaders[0] % width === 0;
        const rightEdge = alienInvaders[alienInvaders.length - 1] % width === width - 1;

        if ((leftEdge && direction === -1) || (rightEdge && direction === 1)) {
            direction = width; // Move para baixo
        } else if (direction === width) {
            if (leftEdge) direction = 1;
            else direction = -1;
        }

        // Remove a classe 'invader' de todos os invasores
        for (let i = 0; i <= alienInvaders.length - 1; i++) {
            squares[alienInvaders[i]].classList.remove('invader');
        }

        // Move os invasores para a nova posição
        for (let i = 0; i <= alienInvaders.length - 1; i++) {
            alienInvaders[i] += direction;
        }

        // Adiciona a classe 'invader' novamente aos invasores
        for (let i = 0; i <= alienInvaders.length - 1; i++) {
            if (!alienInvadersTakenDown.includes(i)) {
                squares[alienInvaders[i]].classList.add('invader');
            }
        }

        // Verificar game over
        if (squares[currentShooterIndex].classList.contains('invader', 'shooter')) {
            squares[currentShooterIndex].classList.add('boom');
            gameOver.style.display = 'flex'
            clearInterval(invaderId);
        }

        for (let i = 0; i <= alienInvaders.length - 1; i++) {
            if (alienInvaders[i] > (squares.length - (width + 1))) {
                gameOver.style.display = 'flex';
                clearInterval(invaderId);
            }
        }

        // Verificar se o jogador ganhou
        if (alienInvadersTakenDown.length === alienInvaders.length) {
            win.style.display = 'flex';
            clearInterval(invaderId);
        }
    }

    invaderId = setInterval(moveInvaders, 500);

    // Atirar nos aliens
    function shoot(e) {
        let laserId;
        let currentLaserIndex = currentShooterIndex;

        // Move o laser do jogador para cima
        function moveLaser() {
            squares[currentLaserIndex].classList.remove('laser');
            currentLaserIndex -= width;
            if (currentLaserIndex >= 0) {
                squares[currentLaserIndex].classList.add('laser');
            }

            // Verificar se o laser atinge um invasor
            if (squares[currentLaserIndex].classList.contains('invader')) {
                squares[currentLaserIndex].classList.remove('laser');
                squares[currentLaserIndex].classList.remove('invader');
                squares[currentLaserIndex].classList.add('boom');

                setTimeout(() => squares[currentLaserIndex].classList.remove('boom'), 250);
                clearInterval(laserId);

                const alienTakenDown = alienInvaders.indexOf(currentLaserIndex);
                alienInvadersTakenDown.push(alienTakenDown);
                result += 2;
                resultDisplay.textContent = result;
            }

            // Remover o laser se atingir o topo da grade
            if (currentLaserIndex < width) {
                clearInterval(laserId);
                setTimeout(() => squares[currentLaserIndex].classList.remove('laser'), 100);
            }
        }

        // Verificar se a tecla de espaço foi pressionada para atirar
        if (e.keyCode === 32) {
            laserId = setInterval(moveLaser, 100);
        }
    }

    document.addEventListener('keyup', shoot);


});
