document.addEventListener('DOMContentLoaded', createBoard);



const cards = [
    'Stark', 'Stark', 'Lannister', 'Lannister',
    'Targaryen', 'Targaryen', 'Baratheon', 'Baratheon',
    'Tyrell', 'Tyrell', 'Martell', 'Martell',
    'Greyjoy', 'Greyjoy', 'Bolton', 'Bolton'
];

let cardValues = [];
let cardIds = [];
let cardsFlipped = 0;
let score = 0;
let timer;
let timeElapsed = 0;

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function createBoard() {
    shuffleArray(cards);
    const grid = document.querySelector('.grid');
    grid.innerHTML = '';
    cards.forEach((card, i) => {
        const cardElement = document.createElement('div');
        cardElement.dataset.id = i;
        grid.appendChild(cardElement);
    });
    score = 0;
    document.getElementById('score').textContent = score;
    timeElapsed = 0;
    document.getElementById('time').textContent = formatTime(timeElapsed);
}

function updateFeedback(score) {
    const message = document.getElementById('memory-message');
    const image = document.getElementById('house-image');

    // Update message or image based on the score
    if (score < 20) {
        message.textContent = "The north remembers";
        image.src = "path/to/low-score-image.jpg"; // Path to a specific image for low scores
    } else if (score >= 20 && score < 50) {
        message.textContent = "Winter is coming";
        image.src = "path/to/medium-score-image.jpg"; // Path to a specific image for medium scores
    } else {
        message.textContent = "King in the North!";
        image.src = "path/to/high-score-image.jpg"; // Path to a specific image for high scores
    }
}



function startMemoryGame() {
    console.log("Memory Game Started");
    createBoard();
    revealCardsTemporarily();
    showFeedback();
}

function showFeedback() {
    const feedbackDiv = document.getElementById('feedback');
    feedbackDiv.style.display = 'flex';  // Change display to 'flex' to show the section
    updateFeedback(0);  // Initialize feedback when the game starts
}

    function updateFeedback(score) {
        console.log("Updating feedback for score:", score);  // Debugging statement
        const message = document.getElementById('memory-message');
        const image = document.getElementById('house-image');
    
        if (score < 20) {
            message.textContent = "The north remembers";
            image.src = "images/lannister.jpeg";
        } else if (score >= 20 && score < 50) {
            message.textContent = "Winter is coming";
            image.src = "images/images.jpeg";  // Ensure this filename is correct
        } else {
            message.textContent = "King in the North!";
            image.src = "images/tyrell.jpeg";
        }
    }
    


    function revealCardsTemporarily() {
        const cardsDivs = document.querySelectorAll('.grid div');
        cardsDivs.forEach((card, index) => {
            card.textContent = cards[index]; // Show card content
            card.classList.add('flipped'); // Apply flipped style
        });
    
        let countdown = 5;
        const messageHeader = document.getElementById('memory-message');
        messageHeader.textContent = "Get ready!"; // Initial message
        playSound('countdown');  // Start countdown sound
    
        const countdownTimer = setInterval(() => {
            if (countdown === 0) {
                clearInterval(countdownTimer);
                cardsDivs.forEach(card => {
                    card.textContent = ''; // Hide card content
                    card.classList.remove('flipped'); // Remove flipped style
                    card.addEventListener('click', flipCard); // Attach event listener for game start
                });
                messageHeader.textContent = "Go!"; // Final message
                startTimer(); // Start the timer after the preview
            } else {
                messageHeader.textContent = `Starting in ${countdown--}...`;
            }
        }, 1000);
    }
    
    
    
    function startTimer() {
        timer = setInterval(() => {
            timeElapsed++;
            document.getElementById('time').textContent = formatTime(timeElapsed);
        }, 1000);
    }

function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

function stopTimer() {
    clearInterval(timer);
}

function flipCard() {
    const cardId = this.dataset.id;
    if (!this.classList.contains('flipped') && cardValues.length < 2) {
        this.classList.add('flipped');
        this.textContent = cards[cardId];
        cardValues.push(cards[cardId]);
        cardIds.push(cardId);
        playSound('shuffle');  // Sound effect for card flipping
        if (cardValues.length === 2) {
            setTimeout(checkForMatch, 500);
        }
    }
}

function checkForMatch() {
    const cardsElements = document.querySelectorAll('.grid div');
    const optionOneId = cardIds[0];
    const optionTwoId = cardIds[1];
    
    if (cardValues[0] === cardValues[1]) {
        cardsElements[optionOneId].classList.add('matched');
        cardsElements[optionTwoId].classList.add('matched');
        score += 10;
        document.getElementById('score').textContent = score;
        playSound('match');  // Sound effect for a correct match
        cardsFlipped += 2;
        updateFeedback(score);
    } else {
        cardsElements[optionOneId].classList.remove('flipped', 'matched');
        cardsElements[optionTwoId].classList.remove('flipped', 'matched');
        cardsElements[optionOneId].textContent = '';
        cardsElements[optionTwoId].textContent = '';
    }
    
    cardValues = [];
    cardIds = [];
    
    if (cardsFlipped === cards.length) {
        stopTimer();
        // Create a banner message instead of an alert
        const banner = document.getElementById('game-banner');
        banner.innerHTML = `<h2>Congratulations!</h2>
            <p>All cards matched! Your score: ${score}.</p>
            <p>Total time elapsed: ${formatTime(timeElapsed)}</p>`;
        banner.style.display = 'block';
        console.log(`Game ended. Final score: ${score}. Total time elapsed: ${timeElapsed} seconds.`);
    }
}


function updatePerformanceImage(timeElapsed) {
    const image = document.getElementById('performance-image');
    console.log("Updating performance image for elapsed time:", timeElapsed);  // Log the elapsed time
    let src = '', alt = '';

    // Define different images for different time ranges
    if (timeElapsed <= 30) {
        src = 'images/fast.jpg';  // Path to the image for fast completion
        alt = 'Amazing speed!';
    } else if (timeElapsed <= 60) {
        src = 'images/moderate.jpg';
        alt = 'Great job!';
    } else if (timeElapsed <= 120) {
        src = 'images/slow.jpg';
        alt = 'Good effort!';
    } else {
        src = 'images/very-slow.jpg';
        alt = 'Keep practicing!';
    }

    // Set the image source, alt text, and make sure it's visible
    image.src = src;
    image.alt = alt;
    image.style.display = 'block'; // Make sure the image is visible
}




function playSound(soundType) {
    const soundMap = {
        shuffle: 'sounds/card-sounds-35956.mp3',
        match: 'sounds/correct-156911.mp3',
        countdown: 'sounds/female-robotic-countdown-5-to-1-47653.mp3'
    };
    let audio = new Audio(soundMap[soundType]);
    audio.play();
}




function startAttributeGame() {
    console.log("Attribute Game Started");
    // Display questions and options for the player to choose
}

function calculateHouse() {
    console.log("Calculating Your House");
    // Analyze results from both games and display the house
}
