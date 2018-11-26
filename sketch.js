const canvasWidth = 832;
const canvasHeight = 624;

// game state variables
let gameStarted = false;
let gameEnded = false;
let teacherFinished = false;
let playerFinished = false;

let playerMoves = ['still'];
let currentMove;

function preload() {
    // load font
    levelFont = loadFont('fonts/COMICBD.TTF')

    // load audio
    sd_title = loadSound('audio/song_title.wav')
    sd_game = loadSound('audio/song_game.wav')
    //sd_move = loadSound('audio/song_move.wav')

    // load start menu animation
    ani_start = loadAnimation('visual/title0.png', 'visual/title1.png', 'visual/title2.png', 'visual/title3.png')
    ani_start.looping = false
    ani_title = loadAnimation('visual/title2.png', 'visual/title3.png')

    // load still images
    img_bg = loadImage('visual/bg.jpg')
    img_clouds = loadImage('visual/clouds.png')
    img_teacher = loadImage('visual/teacher.png')
    img_player = loadImage('visual/player.png')

    // load teacher animations
    ani_teacherUp = loadAnimation('visual/teacher.png', 'visual/teacherUp0.png', 'visual/teacherUp1.png', 'visual/teacherUp0.png', 'visual/teacher.png');
    ani_teacherDown = loadAnimation('visual/teacher.png', 'visual/teacherDown0.png', 'visual/teacherDown1.png', 'visual/teacherDown0.png', 'visual/teacher.png')
    ani_teacherLeft = loadAnimation('visual/teacher.png', 'visual/teacherLeft0.png', 'visual/teacherLeft1.png', 'visual/teacherLeft0.png', 'visual/teacher.png')
    ani_teacherRight = loadAnimation('visual/teacher.png', 'visual/teacherRight0.png', 'visual/teacherRight1.png', 'visual/teacherRight0.png', 'visual/teacher.png')

    ani_teacherUp.looping = false;
    ani_teacherDown.looping = false;
    ani_teacherLeft.looping = false;
    ani_teacherRight.looping = false;

    // load player animations
    ani_playerUp = loadAnimation('visual/player.png', 'visual/playerUp0.png', 'visual/playerUp1.png', 'visual/playerUp0.png', 'visual/player.png');
    ani_playerDown = loadAnimation('visual/player.png', 'visual/playerDown0.png', 'visual/playerDown1.png', 'visual/playerDown0.png', 'visual/player.png')
    ani_playerLeft = loadAnimation('visual/player.png', 'visual/playerLeft0.png', 'visual/playerLeft1.png', 'visual/playerLeft0.png', 'visual/player.png')
    ani_playerRight = loadAnimation('visual/player.png', 'visual/playerRight0.png', 'visual/playerRight1.png', 'visual/playerRight0.png', 'visual/player.png')

    ani_playerUp.looping = false;
    ani_playerDown.looping = false;
    ani_playerLeft.looping = false;
    ani_playerRight.looping = false;

}

function setup() {
    //noSmooth()

    // start menu audio
    sd_title.setVolume(0.5)
    sd_title.play()
    sd_title.loop()

    createCanvas(canvasWidth, canvasHeight);
    background(0, 100, 200, 80);
    createLevels();
    createTeacher();
}

function keyPressed() {
    if (keyCode == 32) {
        if (!gameStarted){
            sd_title.stop();
            sd_game.setVolume(0.1);
            sd_game.playMode('sustain');
            sd_game.loop();
            sd_game.play();
            gameStarted = true;
        }
    }

    if (!gameEnded){
        if (keyCode == ENTER) { //continue to next level
            currentLevel += 1
            // reset stuff
            teacherCurrentMoveNo = 0
            //teacherSpeed -= 5
            playerMoves = ['still'];
            teacherMoves = ['still'];
            teacherFinished = false;
            playerFinished = false;
            createLevels();
        }

        if (teacherFinished && !playerFinished) {
            if (keyCode == UP_ARROW) {
                currentMove = 'up'
                playerMoves.push(currentMove)
                playerMoves.push('still')
            }
            else if (keyCode == DOWN_ARROW) {
                currentMove = 'down'
                playerMoves.push(currentMove)
                playerMoves.push('still')
            }
            else if (keyCode == LEFT_ARROW) {
                currentMove = 'left'
                playerMoves.push(currentMove)
                playerMoves.push('still')
            }
            else if (keyCode == RIGHT_ARROW) {
                currentMove = 'right'
                playerMoves.push(currentMove)
                playerMoves.push('still')
            }
        }      
    }

}


function draw() {
    if (!gameStarted) {
        startMenu()
    }
    else { // game started
        background(0, 100, 200, 80)
        image(img_bg, 0, 0, canvasWidth, canvasHeight)
        drawClouds();
        drawSprites();

        //level text
        fill(0)
        textFont(levelFont)
        textSize(30)
        text('Level ' + currentLevel, canvasWidth / 20, canvasHeight / 16)

        //delay this!
        if (frameCount % teacherSpeed == 0) {
            teacherMove();
        }

        if (teacherFinished) {
            textAlign(CENTER);
            textSize(40);
            fill(0);
            stroke(0);
            strokeWeight(2);
            text('Your turn!', canvasWidth / 4, canvasHeight / 4);
        }
        playerMove();
        if (playerFinished) {
            examineMove()
        }          
    }
}

// create start menu
var ani_startFinished = false

function startMenu() {
    ani_start.frameDelay = 60
    animation(ani_start, canvasWidth / 2, canvasHeight / 2)
    if (ani_start.getFrame() == ani_start.getLastFrame()) {
        ani_startFinished = true;
    }

    if (ani_startFinished == true) {
        ani_title.frameDelay = 30;
        animation(ani_title, canvasWidth / 2, canvasHeight / 2);

        fill(0);
        textFont(levelFont);
        textSize(30);
        text('Press Space to start', canvasWidth / 4, canvasHeight - canvasHeight / 4);
    }
}

/*---------------------------------------in set up-------------------------------------*/
createTeacher = function() {
    teacher = createSprite(canvasWidth / 2, canvasHeight / 2)
    teacher.addImage('still', img_teacher)
    teacher.addAnimation('up', ani_teacherUp)
    teacher.addAnimation('down', ani_teacherDown)
    teacher.addAnimation('left', ani_teacherLeft)
    teacher.addAnimation('right', ani_teacherRight)
}

var currentLevel = 1
var moves = ['up', 'down', 'right', 'left']
var teacherMoves = ['still']

createLevels = function() {
    // generate and store random jestures of teacher
    this.noOfMoves = currentLevel;
    for (var i = 0; i < noOfMoves; i++) {
        teacherMoves.push(moves[floor(random(4))])
        teacherMoves.push('still')
    }
    console.log(teacherMoves)
}


/*----------------------------------in draw-------------------------------------*/
// draw clouds
var cloudsX = 0;
var cloudsY = canvasHeight / 12;
drawClouds = function() {
    image(img_clouds, cloudsX, cloudsY)
    image(img_clouds, cloudsX + canvasWidth, cloudsY)
    image(img_clouds, cloudsX - canvasWidth, cloudsY)
    cloudsX += currentLevel
    if (cloudsX > canvasWidth) {
        cloudsX = 0
    }
    if (cloudsX < -canvasWidth) {
        cloudsX = canvasWidth
    }
}


let teacherCurrentMoveNo = 0
//teacherCurrentMove = teacherMoves[teacherCurrentMoveNo]
let teacherSpeed = 20 // can be 20, 15, 10 only

teacherMove = function() {
    if (teacherCurrentMoveNo < teacherMoves.length) {
        let teacherCurrentMove = teacherMoves[teacherCurrentMoveNo];
        teacher.changeAnimation(teacherCurrentMove);
        teacher.animation.rewind();
        teacherCurrentMoveNo += 1;
    }
    else if (teacherCurrentMoveNo >= teacherMoves.length) {
        teacherFinished = true;
    }
}



/*
playerMove = function()
{
  if (playerMoves.length == teacherMoves.length){
    playerFinished = true;
  }
  if (playerTurn == true && playerFinished == false){
    player.changeAnimation(currentMove)
    player.animation.rewind()
  }
}
*/


playerMove = function() {
    if (playerMoves.length === teacherMoves.length) {
        playerFinished = true;
    }
    if (teacherFinished && !playerFinished) {
        if (keyIsPressed && keyCode == UP_ARROW) {
            animation(ani_playerUp, canvasWidth / 2, canvasHeight / 2);
        }
        else if (keyIsPressed && keyCode == DOWN_ARROW) {
            animation(ani_playerDown, canvasWidth / 2, canvasHeight / 2);
        }
        else if (keyIsPressed && keyCode == LEFT_ARROW) {
            animation(ani_playerLeft, canvasWidth / 2, canvasHeight / 2);
        }
        else if (keyIsPressed && keyCode == RIGHT_ARROW) {
            animation(ani_playerRight, canvasWidth / 2, canvasHeight / 2);
        }
        else {
            image(img_player, 0, 0);
            ani_playerUp.rewind();
            ani_playerDown.rewind();
            ani_playerLeft.rewind();
            ani_playerRight.rewind();
        }
    }
    else {
        image(img_player, 0, 0);
        ani_playerUp.rewind();
        ani_playerDown.rewind();
        ani_playerLeft.rewind();
        ani_playerRight.rewind();
    }
}

examineMove = function() {
    if (arraysAreIdentical(playerMoves, teacherMoves)) {
        textAlign(CENTER);
        fill(255);
        textSize(50);
        text('good.', canvasWidth / 2, canvasHeight / 2);
        textSize(25)
        text('Press Enter to next level', canvasWidth / 2, canvasHeight - canvasHeight / 5);
    }
    else {
        textAlign(CENTER);
        fill(255, 0, 0);
        textSize(50);
        text('WRONG!', canvasWidth / 2, canvasHeight / 2);
        fill(255);
        textSize(25);
        text('refresh to restart', canvasWidth / 2, canvasHeight - canvasHeight / 5);
        gameEnded = true;
    }
}

function arraysAreIdentical(arr1, arr2) {
    if (arr1.length !== arr2.length) return false;
    for (var i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
            return false;
        }
    }
    return true;
}