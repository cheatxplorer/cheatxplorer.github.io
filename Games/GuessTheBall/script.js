let ballPosition;
let gameOver = false;
let coins = 1000;
let bet = 0;

function startGame() {
    ballPosition = Math.floor(Math.random() * 3) + 1;
    gameOver = false;
    document.getElementById("message").innerText = "";
    hideBall();
    updateDisplay();
}

function hideBall() {
    for (let i = 1; i <= 3; i++) {
        const cup = document.getElementById(`cup${i}`);
        cup.classList.remove("revealed");
        cup.querySelector(".ball").style.visibility = "hidden";
    }
}

function revealBall() {
    const cup = document.getElementById(`cup${ballPosition}`);
    cup.classList.add("revealed");
    cup.querySelector(".ball").style.visibility = "visible";
}

function guess(cupNumber) {
    if (gameOver) return;

    if (bet === 0) {
        document.getElementById("message").innerText = "Please place a bet before guessing.";
        return;
    }

    gameOver = true;
    revealBall();
    if (cupNumber === ballPosition) {
        coins += bet;
        document.getElementById("message").innerText = "Congratulations! You guessed it right!";
    } else {
        coins -= bet;
        document.getElementById("message").innerText = "Sorry, try again!";
    }
    updateDisplay();
}

function resetGame() {
    bet = 0;
    startGame();
}

function increaseBet() {
    if (bet < coins) {
        bet += 10;
        updateDisplay();
    }
}

function decreaseBet() {
    if (bet > 0) {
        bet -= 10;
        updateDisplay();
    }
}

function updateDisplay() {
    document.getElementById("coins").innerText = coins;
    document.getElementById("bet").innerText = bet;
}

document.addEventListener("DOMContentLoaded", () => {
    startGame();
});
