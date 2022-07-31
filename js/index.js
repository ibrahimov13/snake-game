const gameBoard = document.querySelector("#gameBoard");
const ctx = gameBoard.getContext("2d");

const highScoreContainer = document.querySelector("#highScoreContainer");
const scoreContainer = document.querySelector("#scoreContainer");

const btnGroups = document.querySelector("#btnGroups");
const restartBtn = document.querySelector("#restartBtn");
const playGameBtn = document.querySelector("#playGameBtn");
const exitBtn = document.querySelector("#exitBtn");
const settingsBtn = document.querySelector("#settingsBtn");
const homeBtn = document.querySelector("#homeBtn");
const backBtn = document.querySelector("#backBtn");
const selectBtn = document.querySelector("#selectBtn");
const select = document.querySelectorAll("select");
const selectBtnColor = document.querySelector("#selectBtnColor");

const introPage = document.querySelector("#introPage");

const gameProgress = document.querySelector("#gameProgress");
const gameProgressBar = document.querySelector("#gameProgressBar");
const snakePhoto = document.querySelector("#snakePhoto");
const upBtn = document.querySelector("#upBtn");
const downBtn = document.querySelector("#downBtn");
const leftBtn = document.querySelector("#leftBtn");
const rightBtn = document.querySelector("#rightBtn");

const scoreText = document.querySelector("#scoreText");
const highScoreText = document.querySelector("#highScoreText");

const countdown = document.querySelector("#countdown");

const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;

const boardBackground = "black";
let snakeColor = "yellow";
const snakeBorder = "black";
const foodColor = "red";

const unitSize = 25;
let running = false;
let xVelocity = unitSize;
let yVelocity = 0;

let foodX;
let foodY;

let score = 0;
let maxScore = 0;

let power = 250;

let snake = [
    {x: unitSize * 4, y: 0},
    {x: unitSize * 3, y: 0},
    {x: unitSize * 2, y: 0},
    {x: unitSize, y: 0},
    {x: 0, y: 0}
];

let eatSoundEffect = new Audio("./files/eating-sound-effect.mp3");

const scores = JSON.parse(localStorage.getItem("scores") || "[]");

function home(){

    var one = localStorage.getItem("one");

    if(one != '1'){
        let scoreInfo = {
            scoreone: `${maxScore}`
        }
        scores.push(scoreInfo);
        
        localStorage.setItem("scores", JSON.stringify(scores));

        localStorage.setItem('one', '1');
    }

    highScoreText.textContent = scores[0].scoreone;

    let width = 0;
    const introPageLoad = setInterval(() => {
        if(width == 100){
            clearInterval(introPageLoad);
            highScoreContainer.style.display = "flex";
            scoreContainer.style.display = "none";
            introPage.style.display = "none";
            btnGroups.style.display = "flex";
            selectBtn.style.display = "none";
            selectBtnColor.style.display = "none";
            backBtn.style.display = "none";
            homeBtn.style.display = "none";
            restartBtn.style.display = "none";
            ctx.font = "40px 'Press Start 2P'";
            ctx.fillStyle = "yellow";
            ctx.textAlign = "center";
            ctx.fillText("SNAKE GAME", gameWidth / 2, gameHeight / 6);
        }else{
            width++;
            gameProgressBar.style.width = width + '%';
        }
    }, 10);
}

home();

playGameBtn.addEventListener("click", gameStart);

function gameStart(){
    clearBoard();
    scoreContainer.style.display = "flex";
    highScoreContainer.style.display = "none";
    btnGroups.style.display = "none";
    countdown.style.display = "flex";
    setTimeout(() => {
        countdown.textContent = "2";
    }, 600);
    setTimeout(() => {
        countdown.textContent = "1";
    }, 1200);
    setTimeout(() => {
        countdown.textContent = "GO!";
    }, 1800);

    setTimeout(() => {
        nextTick();
        countdown.style.display = "none";
    }, 2400);
    
    running = true;
    scoreText.textContent = score;

    createFood();
    drawFood();
    drawSnake();
};

restartBtn.addEventListener("click", restartGame);

function restartGame(){
    clearBoard();
    score = 0;
    xVelocity = unitSize;
    yVelocity = 0;
    snake = [
        {x: unitSize * 4, y: 0},
        {x: unitSize * 3, y: 0},
        {x: unitSize * 2, y: 0},
        {x: unitSize, y: 0},
        {x: 0, y: 0}
    ];
    countdown.textContent = "3";
    gameStart();
};


homeBtn.addEventListener("click", () => {
    clearBoard();
    ctx.font = "40px 'Press Start 2P'";
    ctx.fillStyle = "yellow";
    ctx.textAlign = "center";
    ctx.fillText("SNAKE GAME", gameWidth / 2, gameHeight / 6);

    playGameBtn.style.display = "block";
    settingsBtn.style.display = "block";
    exitBtn.style.display = "block";
    homeBtn.style.display = "none";
    restartBtn.style.display = "none";
    countdown.textContent = "3";
    highScoreContainer.style.display = "flex";
    scoreContainer.style.display = "none";
    highScoreText.textContent = scores[0].scoreone;
});

settingsBtn.addEventListener("click", settings);

function settings(){
    selectBtn.style.display = "block";
    selectBtnColor.style.display = "block";
    backBtn.style.display = "block";
    playGameBtn.style.display = "none";
    settingsBtn.style.display = "none";
    exitBtn.style.display = "none";
    ctx.font = "30px 'Anton', sans-serif";
    ctx.fillStyle = "yellow";
    ctx.textAlign = "center";
    ctx.fillText("GAME SPEED AND SNAKE COLOR", gameWidth / 2, gameHeight / 3.5);
}

selectBtn.addEventListener("click", selectSpeedMode);

function selectSpeedMode(){
    if(selectBtn.value == "hard"){
        power = 100;
    }else if(selectBtn.value == "normal"){
        power = 200;
    }else{
        power = 250;
    }
}

selectBtnColor.addEventListener("click", selectSnakeColor);

function selectSnakeColor(){
    if(selectBtnColor.value == "green"){
        snakeColor = "green";
    }else if(selectBtnColor.value == "blue"){
        snakeColor = "blue";
    }else{
        snakeColor = "yellow";
    }
}


backBtn.addEventListener("click", backMenu);

function backMenu(){
    clearBoard();
    ctx.font = "40px 'Press Start 2P'";
    ctx.fillStyle = "yellow";
    ctx.textAlign = "center";
    ctx.fillText("SNAKE GAME", gameWidth / 2, gameHeight / 6);
    playGameBtn.style.display = "block";
    settingsBtn.style.display = "block";
    exitBtn.style.display = "block";
    selectBtn.style.display = "none";
    backBtn.style.display = "none";
    selectBtnColor.style.display = "none";
    selectSpeedMode();
    selectSnakeColor();
};


exitBtn.addEventListener("click", () => {
    confirm = confirm("Do you want to close the game screen?");
    if(confirm == true){
        window.close();
    }else{
        
    }
});

function nextTick(){
    if(running){
        setTimeout(() => {
            clearBoard();
            drawFood();
            moveSnake();
            drawSnake();
            checkGameOver();
            nextTick();
        }, power);
    }else{
        displayGameOver();
    }
};

function clearBoard(){
    ctx.fillStyle = boardBackground;
    ctx.fillRect(0, 0, gameWidth, gameHeight);
};

function createFood(){
    function randomFood(min, max){
        const randNum = Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
        return randNum;
    }
    foodX = randomFood(0, gameWidth - unitSize);
    foodY = randomFood(0, gameWidth - unitSize);
    console.log(foodX, foodY);
};

function drawFood(){
    ctx.fillStyle = foodColor;
    ctx.fillRect(foodX, foodY, unitSize, unitSize);
};

function moveSnake(){
    const head = {
                    x: snake[0].x + xVelocity,
                    y: snake[0].y + yVelocity
                };
    snake.unshift(head);
    // if food is eaten
    if(snake[0].x == foodX && snake[0].y == foodY){
        eatSoundEffect.play();
        score += 1;
        scoreText.textContent = score;
        createFood();
    }else{
        snake.pop();
    }
};

function drawSnake(){
    ctx.fillStyle = snakeColor;
    ctx.strokeStyle = snakeBorder;
    snake.forEach(snakePart => {
        ctx.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);
        ctx.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize);
    })
};

window.addEventListener("keydown", changeDirection);
upBtn.addEventListener("click", changeDirectionMobUp);
downBtn.addEventListener("click", changeDirectionMobDown);
rightBtn.addEventListener("click", changeDirectionMobRight);
leftBtn.addEventListener("click", changeDirectionMobLeft);

function changeDirectionMobUp(){

    const goingUp = (yVelocity == -unitSize);
    const goingDown = (yVelocity == unitSize);
    const goingRight = (xVelocity == unitSize);
    const goingLeft = (xVelocity == -unitSize);

    if(upBtn.click && !goingDown){
        xVelocity = 0;
        yVelocity = -unitSize;
    }
};

function changeDirectionMobDown(){

    const goingUp = (yVelocity == -unitSize);
    const goingDown = (yVelocity == unitSize);
    const goingRight = (xVelocity == unitSize);
    const goingLeft = (xVelocity == -unitSize);

    if(downBtn.click && !goingUp){
        xVelocity = 0;
        yVelocity = unitSize;
    }
};

function changeDirectionMobLeft(){

    const goingUp = (yVelocity == -unitSize);
    const goingDown = (yVelocity == unitSize);
    const goingRight = (xVelocity == unitSize);
    const goingLeft = (xVelocity == -unitSize);

    if(leftBtn.click && !goingRight){
        xVelocity = -unitSize;
        yVelocity = 0;
    }
};

function changeDirectionMobRight(){

    const goingUp = (yVelocity == -unitSize);
    const goingDown = (yVelocity == unitSize);
    const goingRight = (xVelocity == unitSize);
    const goingLeft = (xVelocity == -unitSize);

    if(rightBtn.click && !goingLeft){
        xVelocity = unitSize;
        yVelocity = 0;
    }
};

function changeDirection(event){
    const keyPressed = event.keyCode;
    console.log(keyPressed);
    const LEFT = 37;
    const UP = 38;
    const RIGHT = 39;
    const DOWN = 40;

    const goingUp = (yVelocity == -unitSize);
    const goingDown = (yVelocity == unitSize);
    const goingRight = (xVelocity == unitSize);
    const goingLeft = (xVelocity == -unitSize);

    switch(true){
        case(keyPressed == LEFT && !goingRight):
            xVelocity = -unitSize;
            yVelocity = 0;
            break;
        case(keyPressed == UP && !goingDown):
            xVelocity = 0;
            yVelocity = -unitSize;
            break;
        case(keyPressed == RIGHT && !goingLeft):
            xVelocity = unitSize;
            yVelocity = 0;
            break;
        case(keyPressed == DOWN && !goingUp):
            xVelocity = 0;
            yVelocity = unitSize;
            break;
    }
};

function checkGameOver(){
    switch(true){
        case(snake[0].x < 0):
            running = false;
            break;
        case(snake[0].x >= gameWidth):
            running = false;
            break;
        case(snake[0].y < 0):
            running = false;
            break;
        case(snake[0].y >= gameHeight):
            running = false;
            break;
    }
    for(let i = 1; i < snake.length; i+=1){
        if(snake[i].x == snake[0].x && snake[i].y == snake[0].y){
            running = false;
        }
    }
};

function displayGameOver(){
    setTimeout(() => {
        clearBoard();
        ctx.font = "40px 'Press Start 2P'";
        ctx.fillStyle = "yellow";
        ctx.textAlign = "center";
        ctx.fillText("GAME OVER!", gameWidth / 2, gameHeight / 5);
        btnGroups.style.display = "flex";
        homeBtn.style.display = "block";
        restartBtn.style.display = "block";
        exitBtn.style.display = "block";
        playGameBtn.style.display = "none";
        settingsBtn.style.display = "none";
        selectBtnColor.style.display = "none";
        
        //localStorage.removeItem("scores", JSON.stringify(scores));
        //scoreCompare = Math.max(score, maxScore);
        //maxScore = scoreCompare;
        //highScoreText.textContent = `${scores[0]}`;
        
        // let scoreInfo = {
        //     scoreone: `${maxScore}`
        // }
        // scores.push(scoreInfo);
        
        // localStorage.setItem("scores", JSON.stringify(scores));



        var one1 = JSON.parse(localStorage.getItem("scores"));
        //console.log(one1[0].scoreone);

        if(score >= one1[0].scoreone){
            maxScore = score;
            console.log(maxScore);
            //localStorage.removeItem("scores", JSON.stringify(scores));
            scores.pop();
            scoreInfo = {
                scoreone: `${maxScore}`
            }
            scores.push(scoreInfo);
            
            localStorage.setItem("scores", JSON.stringify(scores));
            console.log(scoreInfo);
            console.log(scores);

        }
    }, 100);
    running = false;
    setTimeout(() => {
        score = 0;
        xVelocity = unitSize;
        yVelocity = 0;
        snake = [
            {x: unitSize * 4, y: 0},
            {x: unitSize * 3, y: 0},
            {x: unitSize * 2, y: 0},
            {x: unitSize, y: 0},
            {x: 0, y: 0}
        ];
        drawSnake();
    }, 1500);
};

