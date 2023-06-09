const moves = document.getElementById("moves-count");
const timeValue = document.getElementById("time");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const gameContainer = document.querySelector(".game-container");
const result = document.getElementById("result");
const controls = document.querySelector(".controls-container");

let cards;
let interval;
let firstCard = false;
let secondCard = false;

// Items Array
const items = [
    { name: "bee", image: "bee.png" },
  { name: "crocodile", image: "crocodile.png" },
  { name: "macaw", image: "macaw.png" },
  { name: "gorilla", image: "gorilla.png" },
  { name: "tiger", image: "tiger.png" },
  { name: "monkey", image: "monkey.png" },
  { name: "chameleon", image: "chameleon.png" },
  { name: "piranha", image: "piranha.png" },
  { name: "anaconda", image: "anaconda.png" },
  { name: "sloth", image: "sloth.png" },
  { name: "cockatoo", image: "cockatoo.png" },
  { name: "toucan", image: "toucan.png" }
];

// Initial Time
let seconds = 0,
    minutes = 0;

// Initial moves and wins count
let movesCount = 0, 
    winCount = 0;

// For Timer
const timeGenerator = () => {
    seconds += 1;
    // minutes logic
    if (seconds >= 60) {
        minutes += 1;
        seconds = 0;
    }

    // Format time before displaying
    let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
    let minutesValue = minutes < 10 ? `0${minutes}` : minutes;

    timeValue.innerHTML =  `<span>Time: </span>${minutesValue}:${secondsValue}`;

};

// For calculating moves
const movesCounter = () => {
    movesCount += 1;
    moves.innerHTML = `<span>Moves: </span>${movesCount}`;
};

// Pick random objects from the items array
const generateRandom = (size = 4) => {
    // temporary array
    let tempArray = [...items];
    // initialize cardvalues array
    let cardValues = [];
    // size should be double (4*4 matrix)/2 since pairs of objects should exist
    size = (size*size)/2;
    // Random object selection
    for(let i = 0; i < size; i++){
        let randomIndex = Math.floor(Math.random()*tempArray.length);
        cardValues.push(tempArray[randomIndex]);
        // Once selected remove the object from temp array
        tempArray.splice(randomIndex, 1);
    }
    return cardValues;
};

const matrixGenerator = (cardValues, size = 4) => {
    gameContainer.innerHTML = "";
    cardValues = [...cardValues, ...cardValues]
    // Simple Shuffle
    cardValues.sort(() => (Math.random() - 0.5));
    for(let i = 0; i < size*size; i++){
        /* Create Cards
        before => front side (contains question mark)
        after => back side (contains actual image);
        data-card-values is a custom attribute which stores the names of the cards to match later
        */ 
        gameContainer.innerHTML += `
        <div class="card-container" data-card-value="${cardValues[i].name}">
        <div class="card-before">?</div>
        <div class="card-after">
        <img src="${cardValues[i].image}" class="image"/></div>
        </div>
        `
    }
    // Grid
    gameContainer.style.gridTemplateColumns = `repeat(${size}, auto)`

    // Cards
    cards = document.querySelectorAll(".card-container");
    cards.forEach((card) => {
        card.addEventListener("click", () => {
            // If only selected card is not matched yet, then run this(i.e. already matched card when clicked would be ignored)
            if (!card.classList.contains("matched")) {
                // Flip the clicked card
                card.classList.add("flipped");
                // if it is the first card(!firstCard since first card is initially false)
                if(!firstCard) {
                    // so current card will become firstCard
                    firstCard = card;
                    // current card value become first card value
                    firstCardValue = card.getAttribute("data-card-value");
                }
                else {
                    // increment moves since user selected second card
                    movesCounter();
                    // secondCard and value
                    secondCard = card;
                    let secondCardValue = card.getAttribute("data-card-value");
                    if (firstCardValue == secondCardValue){
                        // if card value matched then add matched class so that they can be ignored next time
                        firstCard.classList.add("matched");
                        secondCard.classList.add("matched");
                        // set first class to be false as the next card selected will be the first now
                        firstCard = false;
                        // winCount increment as user found a correct match
                        winCount += 1;
                        // Check if winCount == half of cardValues
                        if (winCount == Math.floor(cardValues.length / 2)) {
                            result.innerHTML = `<h2>You Won</h2>
                            <h4>Moves: ${movesCount}<h4>`;
                            stopGame();
                        }
                    }
                    else {
                        // if the cards don't match
                        // flip the cards back to normal
                        let [tempFirst, tempSecond] = [firstCard, secondCard];
                        firstCard = false;
                        secondCard = false;

                        let delay = setTimeout(() => {
                            tempFirst.classList.remove("flipped");
                            tempSecond.classList.remove("flipped");
                        }, 900);
                    }
                }
            } 
        })
    })
};

// Start Game
startButton.addEventListener("click", () => {
    movesCount = 0;
    time = 0;
    // controls and buttons visibility
    controls.classList.add("hide");
    stopButton.classList.remove("hide");
    startButton.classList.add("hide");
    // start timer 
    interval = setInterval(timeGenerator, 1000);
    // initial moves
    moves.innerHTML = `<span>Moves: </span> ${movesCount}`;
    initializer();
});

// Stop Game
stopButton.addEventListener("click", stopGame = () => {
    controls.classList.remove("hide");
    stopButton.classList.add("hide");
    startButton.classList.remove("hide");
    clearInterval(interval);
})






// Initialize values and func calls
const initializer = () => {
    result.innerText = "";
    winCount = 0;
    let cardvalues = generateRandom();
    matrixGenerator(cardvalues);
}


