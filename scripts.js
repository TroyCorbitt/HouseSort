// Game questions
const questions = [
    {
        text: "What is your weapon of choice?",
        answers: [
            { text: "A valyrian steel sword", house: "Stark" },
            { text: "A crossbow, precision is key", house: "Lannister" },
            { text: "A dragon", house: "Targaryen" },
            { text: "An axe, brute strength wins", house: "Greyjoy" }
        ],
    },
    {
        text: "How do you handle your enemies?",
        answers: [
            { text: "Execute them honorably", house: "Stark" },
            { text: "Outsmart them with clever schemes", house: "Lannister" },
            { text: "Burn them all", house: "Targaryen" },
            { text: "Raid their lands and take what's yours", house: "Greyjoy" }
        ],
    },
    {
        text: "What's your leadership style?",
        answers: [
            { text: "Lead by example with honor and duty", house: "Stark" },
            { text: "Strategic manipulation and wealth", house: "Lannister" },
            { text: "Command with rightful authority and fire", house: "Targaryen" },
            { text: "Strength and fearlessness", house: "Greyjoy" }
        ],
    },
    {
        text: "What's your family motto?",
        answers: [
            { text: "Winter is Coming", house: "Stark" },
            { text: "A Lannister Always Pays His Debts", house: "Lannister" },
            { text: "Fire and Blood", house: "Targaryen" },
            { text: "We Do Not Sow", house: "Greyjoy" }
        ],
    },
    {
        text: "Where would you prefer to live?",
        answers: [
            { text: "In the cold, honorable North", house: "Stark" },
            { text: "In a wealthy castle on a hill", house: "Lannister" },
            { text: "In an ancient stronghold with dragons", house: "Targaryen" },
            { text: "On the stormy islands, near the sea", house: "Greyjoy" }
        ],
    }
];



// Memory game cards
// Memory game cards
const cards = [
    'Stark', 'Stark', 'Lannister', 'Lannister',
    'Targaryen', 'Targaryen', 'Baratheon', 'Baratheon',
    'Tyrell', 'Tyrell', 'Martell', 'Martell',
    'Greyjoy', 'Greyjoy', 'Bolton', 'Bolton'
];

// Game state variables
let currentQuestionIndex = 0;
let userAnswers = [];
let cardValues = [];
let cardIds = [];
let cardsFlipped = 0;
let score = 0;
let timer;
let timeElapsed = 0;

// Initialize an object to keep track of points for each house
let housePoints = {
    Stark: 0,
    Lannister: 0,
    Targaryen: 0,
    Baratheon: 0,
    Greyjoy: 0,
    Tyrell: 0,
    Martell: 0,
    Bolton: 0
};

function chooseTactic(tactic, house) {
    console.log(`Chose tactic: ${tactic}, for house: ${house}`);
    // Increment the points for the chosen house
    housePoints[house] += 10;  // Assuming each choice is worth 10 points

    // Update the UI to reflect the choice
    updateBattleResult(tactic, house);
}

function updateBattleResult(tactic, house) {
    const resultText = `Your choice to ${tactic} aligns you with House ${house}.`;
    document.getElementById('battle-result').innerHTML = `<p>${resultText}</p>`;
}

function calculateFinalHouse() {
    // Determine the house with the maximum points
    let finalHouse = Object.keys(housePoints).reduce((a, b) => housePoints[a] > housePoints[b] ? a : b);
    alert(`You belong to House ${finalHouse}!`);
}


// Initialize both games when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    createBoard();
    
    // Show the first question right away, but keep the start button visible
    showQuestion(0);
    document.getElementById("question-card").style.display = "block";
});

// ---------- Attribute Game Functions ----------

function startGame() {
    document.getElementById("start-game-button").style.display = "none";
    document.getElementById("next-question-button").style.display = "none"; // Hide next button 
    currentQuestionIndex = 0;
    userAnswers = [];
    showQuestion(currentQuestionIndex);
}

function showQuestion(index) {
    const question = questions[index];
    const questionText = document.getElementById("question-text");
    const answersDiv = document.getElementById("answers");

    questionText.textContent = question.text;
    answersDiv.innerHTML = ""; // Clear previous answers

    question.answers.forEach(answer => {
        const button = document.createElement("button");
        button.textContent = answer.text;
        button.onclick = function() { answerQuestion(answer.house); };
        answersDiv.appendChild(button);
    });
}

function answerQuestion(house) {
    console.log("Answer chosen for house:", house);
    userAnswers.push(house);
    housePoints[house]++;
    
    // Highlight the selected answer
    const buttons = document.querySelectorAll("#answers button");
    buttons.forEach(button => {
        button.disabled = true;
        if (button.textContent === event.target.textContent) {
            button.classList.add("selected");
        }
    });
    
    // Brief pause before moving to next question
    setTimeout(nextQuestion, 800);
}

function nextQuestion() {
    currentQuestionIndex++;
    if (currentQuestionIndex < questions.length) {
        showQuestion(currentQuestionIndex);
    } else {
        document.getElementById("question-card").style.display = "none";
        document.getElementById("next-question-button").style.display = "none";
        document.getElementById("calculate-house-button").style.display = "block";
    }
}

function calculateHouse() {
    console.log("Calculating house based on answers:", userAnswers);
    
    // Find the house with the most points
    let topHouse = "";
    let maxPoints = 0;
    
    for (const [house, points] of Object.entries(housePoints)) {
        if (points > maxPoints) {
            maxPoints = points;
            topHouse = house;
        }
    }
    
    // Display the results
    document.getElementById("results").style.display = "block";
    document.getElementById("attribute-game").style.display = "none";
    
    const houseDescriptions = {
        Stark: "You belong to House Stark: Noble, honorable, and resilient. Winter is coming, and you're prepared to face it with courage and integrity.",
        Lannister: "You belong to House Lannister: Clever, ambitious, and wealthy. You always pay your debts and know how to play the game of thrones.",
        Targaryen: "You belong to House Targaryen: Fierce, determined, and powerful. Fire cannot kill a dragon, and you're ready to take what is yours with fire and blood.",
        Greyjoy: "You belong to House Greyjoy: Bold, independent, and unyielding. What is dead may never die, and you take what you want without sowing."
    };
    
    document.getElementById("house-description").textContent = houseDescriptions[topHouse] || 
        `You belong to House ${topHouse}: A noble house of Westeros with its own proud traditions.`;
    document.getElementById("house-image").src = `images/${topHouse.toLowerCase()}.jpg`;
    document.getElementById("house-image").alt = `House ${topHouse} Sigil`;
}

// ---------- Memory Game Functions ----------

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
    cardsFlipped = 0;
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
    console.log("Updating feedback for score:", score);
    const message = document.getElementById('memory-message');
    const image = document.getElementById('house-image');

    if (score < 20) {
        message.textContent = "The north remembers";
        image.src = "images/lannister.jpeg";
    } else if (score >= 20 && score < 50) {
        message.textContent = "Winter is coming";
        image.src = "images/images.jpeg";
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
        
        // Add points to the corresponding house
        if (cardValues[0] in housePoints) {
            housePoints[cardValues[0]] += 5;
        }
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
        updatePerformanceImage(timeElapsed);
        // Create a banner message instead of an alert
        const banner = document.getElementById('game-banner');
        banner.innerHTML = `<h2>Congratulations!</h2>
            <p>All cards matched! Your score: ${score}.</p>
            <p>Total time elapsed: ${formatTime(timeElapsed)}</p>
            <p>Try the Attribute Game to find your House!</p>`;
        banner.style.display = 'block';
        console.log(`Game ended. Final score: ${score}. Total time elapsed: ${timeElapsed} seconds.`);
    }
}

function updatePerformanceImage(timeElapsed) {
    const image = document.getElementById('performance-image');
    console.log("Updating performance image for elapsed time:", timeElapsed);
    let src = '', alt = '';

    // Define different images for different time ranges
    if (timeElapsed <= 30) {
        src = 'images/fast.jpg';
        alt = 'Amazing speed!';
    } else if (timeElapsed <= 60) {
        src = 'images/medium.jpg';
        alt = 'Great job!';
    } else if (timeElapsed <= 120) {
        src = 'images/slow.jpg';
        alt = 'Good effort!';
    } else {
        src = 'images/janis.jpeg';
        alt = 'Keep practicing!';
    }

    // Set the image source, alt text, and make sure it's visible
    image.src = src;
    image.alt = alt;
    image.style.display = 'block';
}

function chooseTactic(tactic) {
    let resultText = "";
    switch (tactic) {
        case 'attack':
            resultText = "You lead a bold frontal attack, showcasing the bravery of House Baratheon.";
            break;
        case 'defend':
            resultText = "You fortify your defenses, demonstrating the resilience of House Stark.";
            break;
        case 'negotiate':
            resultText = "You negotiate for peace, reflecting the diplomatic nature of House Tyrell.";
            break;
        default:
            resultText = "Unsure of what to do, your indecision leads to consequences...";
            break;
    }
    document.getElementById('battle-result').innerHTML = `<p>${resultText}</p>`;
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