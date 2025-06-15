// Variables globales del juego
let gameState = {
    cards: [],
    flippedCards: [],
    matchedPairs: 0,
    totalPairs: 8,
    attemptsLeft: 10,
    totalAttempts: 0,
    isPlaying: true,
    isLocked: false
};

// Productos Dove para las cartas con sus imágenes
const doveProducts = [
    {
        name: 'Desodorante Vitamin Care',
        image: 'assets/dove-deo-vitamin-care.png.png',
        alt: 'Desodorante Dove Vitamin Care'
    },
    {
        name: 'Jabón Corporal Aroma a Coco',
        image: 'assets/dove-soap-coconut.png.png',
        alt: 'Jabón Corporal Dove Aroma a Coco'
    },
    {
        name: 'Jabón Original',
        image: 'assets/dove-soap-original.png.png',
        alt: 'Jabón Dove Original'
    },
    {
        name: 'Serum Bifásico Tratamiento Capilar',
        image: 'assets/dove-serum-hair.png.png',
        alt: 'Serum Bifásico Dove Tratamiento Capilar'
    },
    {
        name: 'Jabón Líquido para Manos Original',
        image: 'assets/dove-hand-soap.png.png',
        alt: 'Jabón Líquido Dove para Manos Original'
    },
    {
        name: 'Shampoo Regeneración Colágeno',
        image: 'assets/dove-shampoo-collagen.png.png',
        alt: 'Shampoo Dove Regeneración Colágeno'
    },
    {
        name: 'Antitranspirante en Aerosol',
        image: 'assets/dove-aerosol.png.png',
        alt: 'Antitranspirante Dove en Aerosol'
    },
    {
        name: 'Baby Dove',
        image: 'assets/dove-baby.png.png',
        alt: 'Baby Dove'
    }
];

// Verificar que hay exactamente 8 productos
if (doveProducts.length !== 8) {
    console.error('Error: El array doveProducts debe tener exactamente 8 elementos');
}

// Función para mostrar/ocultar pantallas
function showScreen(screenId) {
    // Ocultar todas las pantallas
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    // Mostrar la pantalla solicitada
    const screen = document.getElementById(screenId);
    if (screen) {
        screen.classList.add('active');
        // Si es la pantalla del juego, inicializar el juego
        if (screenId === 'game-screen') {
            resetGame();
        }
        // Si es la pantalla de instrucciones, reiniciar animación de pétalos
        if (screenId === 'instructions-screen') {
            startPetalsAnimationInstructions();
        }
        // Si es la pantalla de bienvenida, reiniciar animación de pétalos
        if (screenId === 'welcome-screen') {
            startPetalsAnimation();
        }
    }
}

// Función para iniciar el juego
function startGame() {
    resetGame();
    showScreen('game-screen');
    generateCards();
}

// Función para reiniciar el juego
function resetGame() {
    // Limpiar el tablero
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';
    
    // Reiniciar el estado del juego
    gameState.flippedCards = [];
    gameState.matchedPairs = 0;
    gameState.attemptsLeft = 10;
    gameState.totalAttempts = 0;
    gameState.isPlaying = true;
    
    // Actualizar la interfaz
    document.getElementById('moves-count').textContent = '0';
    document.getElementById('pairs-found').textContent = '0';
    document.getElementById('attempts-left').textContent = '10';
    
    // Generar nuevas cartas
    generateCards();
}

// Función para verificar si el juego ha terminado
function checkGameEnd() {
    if (gameState.matchedPairs === 8) {
        // El jugador ganó
        setTimeout(() => {
            showVictoryModal();
        }, 500);
    } else if (gameState.attemptsLeft === 0) {
        // El jugador perdió
        setTimeout(() => {
            showLoseModal();
        }, 500);
    }
}

// Función para mostrar el modal de victoria
function showVictoryModal() {
    const modal = document.getElementById('victory-modal');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    // Efecto de confeti en canvas superior
    if (window.confetti) {
        const duration = 2 * 1000;
        const end = Date.now() + duration;
        const confettiCanvas = document.getElementById('confetti-canvas');
        const myConfetti = window.confetti.create(confettiCanvas, { resize: true, useWorker: true });
        (function frame() {
            myConfetti({
                particleCount: 7,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#d4af37', '#fffbea', '#f9e076', '#ffffff']
            });
            myConfetti({
                particleCount: 7,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#d4af37', '#fffbea', '#f9e076', '#ffffff']
            });
            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        })();
    }
}

// Función para mostrar el modal de derrota
function showLoseModal() {
    const modal = document.getElementById('lose-modal');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    // Reproducir sonido de derrota
    const loseSound = document.getElementById('lose-sound');
    if (loseSound) {
        loseSound.currentTime = 0;
        loseSound.play();
    }
    // Vibrar el tablero
    const gameBoard = document.querySelector('.game-board');
    if (gameBoard) {
        gameBoard.classList.add('shake');
        setTimeout(() => {
            gameBoard.classList.remove('shake');
        }, 600);
    }
}

// Función para cerrar cualquier modal
function closeModal() {
    const modals = document.querySelectorAll('.modal-overlay');
    modals.forEach(modal => {
        modal.style.display = 'none';
    });
    document.body.style.overflow = 'auto';
}

// Función para cerrar el modal y volver al inicio
function closeModalAndGoHome() {
    closeModal();
    showScreen('welcome-screen');
    resetGame();
}

// Función para cerrar el modal y reiniciar el juego
function closeModalAndRestart() {
    closeModal();
    resetGame();
    showScreen('instructions-screen');
}

// Función para generar las cartas
function generateCards() {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = ''; // Limpiar el tablero

    // Crear un array con 8 pares de cartas (16 en total)
    const cards = [...doveProducts, ...doveProducts];
    
    // Mezclar las cartas
    shuffleArray(cards);

    // Generar las 16 cartas
    cards.forEach((product, index) => {
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.product = product.name;
        card.dataset.index = index;

        card.innerHTML = `
            <div class="card-front">
                <img src="${product.image}" alt="${product.alt}" loading="lazy">
            </div>
            <div class="card-back">
                <img src="assets/dove-logo.png.png" alt="Logo Dove" class="card-logo">
            </div>
        `;

        // Precargar imágenes
        const img = new Image();
        img.src = product.image;

        card.addEventListener('click', () => flipCard(card));
        gameBoard.appendChild(card);
    });

    // Verificar que solo hay 16 cartas
    const totalCards = document.querySelectorAll('.card').length;
    if (totalCards !== 16) {
        console.error('Error: Se generaron', totalCards, 'cartas en lugar de 16');
        gameBoard.innerHTML = ''; // Limpiar el tablero si hay error
        generateCards(); // Intentar generar de nuevo
    }
}

// Función para actualizar los contadores
function updateCounters() {
    document.getElementById('moves-count').textContent = gameState.totalAttempts;
    document.getElementById('pairs-found').textContent = gameState.matchedPairs;
    document.getElementById('attempts-left').textContent = gameState.attemptsLeft;
}

// Función para voltear una carta
function flipCard(card) {
    // Verificar si el juego está activo y si la carta se puede voltear
    if (!gameState.isPlaying || 
        gameState.flippedCards.length >= 2 || 
        card.classList.contains('flipped') || 
        card.classList.contains('matched')) {
        return;
    }

    // Voltear la carta
    card.classList.add('flipped');
    gameState.flippedCards.push(card);

    // Si se han volteado dos cartas, verificar si coinciden
    if (gameState.flippedCards.length === 2) {
        const [card1, card2] = gameState.flippedCards;
        const match = card1.dataset.product === card2.dataset.product;

        // Incrementar movimientos
        gameState.totalAttempts++;
        // Reducir oportunidades solo si no hay match
        if (!match) {
            gameState.attemptsLeft--;
        } else {
            gameState.matchedPairs++;
        }
        updateCounters();

        if (match) {
            // Si coinciden, marcarlas como emparejadas
            setTimeout(() => {
                card1.classList.add('matched');
                card2.classList.add('matched');
                gameState.flippedCards = [];
                checkGameEnd();
            }, 500);
        } else {
            // Si no coinciden, voltearlas de nuevo
            setTimeout(() => {
                card1.classList.remove('flipped');
                card2.classList.remove('flipped');
                gameState.flippedCards = [];
                checkGameEnd();
            }, 1000);
        }
    }
}

// Función para compartir la puntuación
function shareScore() {
    const score = document.getElementById('score').textContent;
    const attempts = document.getElementById('attempts').textContent;
    const shareText = `¡Gané el Dove Match con ${score} puntos y ${attempts} intentos! ¿Te animás a superarme?`;
    
    if (navigator.share) {
        navigator.share({
            title: 'Dove Match',
            text: shareText,
            url: window.location.href
        }).catch(console.error);
    } else {
        // Fallback para navegadores que no soportan la API Web Share
        const tempInput = document.createElement('input');
        tempInput.value = shareText;
        document.body.appendChild(tempInput);
        tempInput.select();
        document.execCommand('copy');
        document.body.removeChild(tempInput);
        alert('¡Texto copiado al portapapeles!');
    }
}

// Función auxiliar para mezclar array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// ANIMACIÓN DE PÉTALOS EN LA PANTALLA DE BIENVENIDA
function startPetalsAnimation() {
    const canvas = document.getElementById('petals-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    // Crear pétalos
    const petalColors = ['#f7e7c5', '#e6d0f7', '#fffbe6', '#e3e3e3'];
    const petals = Array.from({length: 18}, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: 12 + Math.random() * 10,
        speed: 0.5 + Math.random() * 0.7,
        drift: 0.5 + Math.random() * 1.2,
        angle: Math.random() * Math.PI * 2,
        color: petalColors[Math.floor(Math.random() * petalColors.length)]
    }));
    function drawPetal(p) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(Math.sin(p.angle) * 0.5);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(p.r, -p.r, p.r, p.r, 0, p.r * 1.5);
        ctx.bezierCurveTo(-p.r, p.r, -p.r, -p.r, 0, 0);
        ctx.closePath();
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.7;
        ctx.shadowColor = '#fff';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.restore();
    }
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let p of petals) {
            drawPetal(p);
            p.y += p.speed;
            p.x += Math.sin(p.angle) * p.drift;
            p.angle += 0.01 + Math.random() * 0.01;
            if (p.y > canvas.height + 30) {
                p.y = -30;
                p.x = Math.random() * canvas.width;
            }
            if (p.x < -30) p.x = canvas.width + 30;
            if (p.x > canvas.width + 30) p.x = -30;
        }
        if (document.getElementById('welcome-screen').classList.contains('active')) {
            requestAnimationFrame(animate);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }
    animate();
}

// ANIMACIÓN DE PÉTALOS EN LA PANTALLA DE INSTRUCCIONES
function startPetalsAnimationInstructions() {
    const canvas = document.getElementById('petals-canvas-instructions');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    // Crear pétalos
    const petalColors = ['#f7e7c5', '#e6d0f7', '#fffbe6', '#e3e3e3'];
    const petals = Array.from({length: 18}, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: 12 + Math.random() * 10,
        speed: 0.5 + Math.random() * 0.7,
        drift: 0.5 + Math.random() * 1.2,
        angle: Math.random() * Math.PI * 2,
        color: petalColors[Math.floor(Math.random() * petalColors.length)]
    }));
    function drawPetal(p) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(Math.sin(p.angle) * 0.5);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(p.r, -p.r, p.r, p.r, 0, p.r * 1.5);
        ctx.bezierCurveTo(-p.r, p.r, -p.r, -p.r, 0, 0);
        ctx.closePath();
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.7;
        ctx.shadowColor = '#fff';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.globalAlpha = 1;
        ctx.restore();
    }
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let p of petals) {
            drawPetal(p);
            p.y += p.speed;
            p.x += Math.sin(p.angle) * p.drift;
            p.angle += 0.01 + Math.random() * 0.01;
            if (p.y > canvas.height + 30) {
                p.y = -30;
                p.x = Math.random() * canvas.width;
            }
            if (p.x < -30) p.x = canvas.width + 30;
            if (p.x > canvas.width + 30) p.x = -30;
        }
        if (document.getElementById('instructions-screen').classList.contains('active')) {
            requestAnimationFrame(animate);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }
    animate();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    // Inicializar el juego cuando se carga la página
    showScreen('welcome-screen');
    startPetalsAnimation();
    startPetalsAnimationInstructions();
}); 