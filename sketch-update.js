const canvasWidth = 832;
const canvasHeight = 624;

// game state variables
let gameStarted = false
//let playerTurn = false;
//let teacherFinished = false;
//let playerFinished = false;
let gameEnded = false;

let currentLevel = 0;
let levelPassed = false;
let teacherMovesArr;

let ani_startFinished = false; // check start menu animation

let myclouds = new clouds(canvasWidth, canvasHeight);
let myteacher = new teacher();
let myplayer = new player(canvasWidth, canvasHeight);

function preload() {
    // load the font
    levelFont = loadFont('fonts/COMICBD.TTF');

    // load all sounds
    sd_title = loadSound('audio/song_title.wav');
    sd_game = loadSound('audio/song_game.wav');
    //sd_move = loadSound('audio/song_move.wav');

    // load start menu animations
    ani_start = loadAnimation('visual/title0.png', 'visual/title1.png', 'visual/title2.png', 'visual/title3.png');
    ani_start.looping = false;
    ani_title = loadAnimation('visual/title2.png', 'visual/title3.png');
    ani_start.looping = true;

    // load the still images
    img_bg = loadImage('visual/bg.jpg');
    img_clouds = loadImage('visual/clouds.png');

    // load teacher animations
    myteacher.preloadTeacher();

    // load player animations
    myplayer.preloadPlayer();

}

function setup() {
    noSmooth();

    // title music settings
    sd_title.setVolume(0.5);
    sd_title.play();
    sd_title.loop();

    createCanvas(canvasWidth, canvasHeight);;
    background(0, 100, 200, 80); // set background color to light blue
    //createLevels();
    myteacher.createTeacher(canvasWidth, canvasHeight);

}

function draw() {
    if (!gameStarted) {
        displayStartMenu()
    }
    else{
        // display game
        background(0, 100, 200, 80);
        image(img_bg, 0, 0, canvasWidth, canvasHeight);
        myclouds.drawClouds(currentLevel);
        drawSprites();

        //level text
        fill(0);
        textFont(levelFont);
        textSize(30);
        text('Level ' + currentLevel, canvasWidth / 20, canvasHeight / 16);
        

        if (myplayer.playerMovesArr.length === teacherMovesArr.length){
            myplayer.playerFinished = true;
            examineMove(myplayer.playerMovesArr, teacherMovesArr);
        }
        else{
            if (myteacher.finishedPlaying){
                textAlign(CENTER);
                textSize(40)
                fill(0)
                stroke(0)
                strokeWeight(2)
                text('Your turn!', canvasWidth / 4, canvasHeight / 4)
                if (!keyIsPressed){
                    myplayer.playerStill();
                }
            }
            else{
                myteacher.playTeacherMoves(teacherMovesArr, frameCount);
                myplayer.playerStill();
            }         
        }
    }
}

function keyReleased() {
    // press space to start the game
    if (keyCode == 32) {
        // stop the title music
        sd_title.stop();

        // start game music
        sd_game.setVolume(0.1);
        sd_game.playMode('sustain');
        sd_game.loop();
        sd_game.play();
        gameStarted = true;
        currentLevel += 1; // 0 -> 1
        teacherMovesArr = myteacher.createTeacherMoves(currentLevel);
    }

    // press enter to move to next level
    if (keyCode === ENTER) { //continue to next level
        if (currentLevel>0 && levelPassed) {
            currentLevel += 1
            teacherMovesArr = myteacher.createTeacherMoves(currentLevel);
            //teacherCurrentMoveNo = 0
            //teacherSpeed -= 5
            myplayer.resetPlayer();
            //playerTurn = false;
           // teacherFinished = false;
            //playerFinished = false;
            //let currentTeacherMoves = createLevels(currentLevel);
        }
    }
    if (myteacher.finishedPlaying && !myplayer.playerFinished) {
        if (keyCode == UP_ARROW) {
            myplayer.playerMoveUp();
        }
        else if (keyCode == DOWN_ARROW) {
            myplayer.playerMoveDown();
        }
        else if (keyCode == LEFT_ARROW) {
            myplayer.playerMoveLeft();
        }
        else if (keyCode == RIGHT_ARROW) {
            myplayer.playerMoveRight();
        }
    }
}

function displayStartMenu() {
    // each frame of the start animation plays by 1 second
    ani_start.frameDelay = 60
    animation(ani_start, canvasWidth / 2, canvasHeight / 2);
    // if we played the start animation to the last frame already
    if (ani_start.getFrame() === ani_start.getLastFrame()) {
        ani_startFinished = true;
    }
    if (ani_startFinished === true) {
        // each frame of the title animation plays by 0.5 second
        ani_title.frameDelay = 30;
        animation(ani_title, canvasWidth / 2, canvasHeight / 2); // this animation is looping

        fill(0);
        textFont(levelFont);
        textSize(30);
        text('Press Space to start', canvasWidth / 4, canvasHeight - canvasHeight / 4);
    }
}

function clouds(canvasWidth, canvasHeight){
    this.cloudsX = 0;
    this.cloudsY = canvasHeight / 12;
    this.drawClouds = function(currentLevel){
        image(img_clouds, this.cloudsX, this.cloudsY);
        image(img_clouds, this.cloudsX + canvasWidth, this.cloudsY);
        image(img_clouds, this.cloudsX - canvasWidth, this.cloudsY);
        this.cloudsX += currentLevel; // speed of cloud movements is according to current level
        if (this.cloudsX > canvasWidth) {
            this.cloudsX = 0;
        }
        if (this.cloudsX < -canvasWidth) {
            this.cloudsX = canvasWidth;
        }
    }
}

function teacher(){
    this.preloadTeacher = function(){
        this.img_teacher = loadImage('visual/teacher.png');
        this.ani_teacherUp = loadAnimation('visual/teacher.png', 'visual/teacherUp0.png', 'visual/teacherUp1.png', 'visual/teacherUp0.png', 'visual/teacher.png');
        this.ani_teacherDown = loadAnimation('visual/teacher.png', 'visual/teacherDown0.png', 'visual/teacherDown1.png', 'visual/teacherDown0.png', 'visual/teacher.png');
        this.ani_teacherLeft = loadAnimation('visual/teacher.png', 'visual/teacherLeft0.png', 'visual/teacherLeft1.png', 'visual/teacherLeft0.png', 'visual/teacher.png');
        this.ani_teacherRight = loadAnimation('visual/teacher.png', 'visual/teacherRight0.png', 'visual/teacherRight1.png', 'visual/teacherRight0.png', 'visual/teacher.png');

        this.ani_teacherUp.looping = false;
        this.ani_teacherDown.looping = false;
        this.ani_teacherLeft.looping = false;
        this.ani_teacherRight.looping = false;
    }
    this.createTeacher = function(canvasWidth, canvasHeight) {
        this.teacherSpr = createSprite(canvasWidth / 2, canvasHeight / 2);
        this.teacherSpr.addImage('still', this.img_teacher);
        this.teacherSpr.addAnimation('up', this.ani_teacherUp);
        this.teacherSpr.addAnimation('down', this.ani_teacherDown);
        this.teacherSpr.addAnimation('left', this.ani_teacherLeft);
        this.teacherSpr.addAnimation('right', this.ani_teacherRight);
    }

    this.finishedPlaying = false;
    this.currentTeacherMoveIndex = 0;
    this.teacherSpeed = 20; // can be 20, 15, 10 only
    this.createTeacherMoves = function(currentLevel){
        // call this function at the beginning of each level
        // generate and return randomly movements of teacher
        const movesArr = ['up', 'down', 'right', 'left'];
        let numMoves = currentLevel;
        let teacherMovesArr = ['still'];
        for (let i = 0; i < numMoves; i++) {
            teacherMovesArr.push(movesArr[floor(random(4))]) // pick one of the 4 movements
            teacherMovesArr.push('still')
        }
        console.log(teacherMovesArr);

        // reset
        this.finishedPlaying = false;
        this.currentTeacherMoveIndex = 0;
        return teacherMovesArr;
    }
    this.updateTeacherSpeed = function(spd){
        // call this function after certain levels
        this.teacherSpeed = spd;
    }
    this.playTeacherMoves = function(teacherMovesArr, frameCount){
        let currentTeacherMove = teacherMovesArr[this.currentTeacherMoveIndex];
        // if finish playing all the teacher animations
        if (this.currentTeacherMoveIndex > teacherMovesArr.length){
            this.finishedPlaying = true;
        }
        // the intervals of playing teacher animations
        if (frameCount % this.teacherSpeed === 0 && !this.finishedPlaying) {
            console.log(currentTeacherMove);
            this.teacherSpr.changeAnimation(currentTeacherMove);
            // teacher animations only loop once, so rewind
            this.teacherSpr.animation.rewind();
            this.currentTeacherMoveIndex+=1;
        }
    }
}

function player(canvasWidth, canvasHeight){
    this.preloadPlayer = function(){
        this.img_player = loadImage('visual/player.png');

        this.ani_playerUp = loadAnimation('visual/player.png', 'visual/playerUp0.png', 'visual/playerUp1.png', 'visual/playerUp0.png', 'visual/player.png');
        this.ani_playerDown = loadAnimation('visual/player.png', 'visual/playerDown0.png', 'visual/playerDown1.png', 'visual/playerDown0.png', 'visual/player.png');
        this.ani_playerLeft = loadAnimation('visual/player.png', 'visual/playerLeft0.png', 'visual/playerLeft1.png', 'visual/playerLeft0.png', 'visual/player.png');
        this.ani_playerRight = loadAnimation('visual/player.png', 'visual/playerRight0.png', 'visual/playerRight1.png', 'visual/playerRight0.png', 'visual/player.png');

        this.ani_playerUp.looping = false;
        this.ani_playerDown.looping = false;
        this.ani_playerLeft.looping = false;
        this.ani_playerRight.looping = false;
    }

    this.playerMovesArr = ['still'];
    this.playerFinished = false;

    this.resetPlayer = function(){
        this.playerMovesArr = ['still'];
        this.playerFinished = false;
    }

    this.playerMoveUp = function(){
        animation(this.ani_playerUp, canvasWidth / 2, canvasHeight / 2);
        this.playerMovesArr.push('up');
        this.playerMovesArr.push('still');
    }
    this.playerMoveDown = function(){
        animation(this.ani_playerDown, canvasWidth / 2, canvasHeight / 2);
        this.playerMovesArr.push('down');
        this.playerMovesArr.push('still');
    }
    this.playerMoveLeft = function(){
        animation(this.ani_playerLeft, canvasWidth / 2, canvasHeight / 2);
        this.playerMovesArr.push('left');
        this.playerMovesArr.push('still');    
    }
    this.playerMoveRight = function(){
        animation(this.ani_playerRight, canvasWidth / 2, canvasHeight / 2);
        this.playerMovesArr.push('right');
        this.playerMovesArr.push('still');
    }
    this.playerStill = function(){
        image(this.img_player, 0, 0);
        this.ani_playerUp.rewind();
        this.ani_playerDown.rewind();
        this.ani_playerLeft.rewind();
        this.ani_playerRight.rewind();
    }
}

function examineMove(playerMovesArr, teacherMovesArr){
    if (arraysAreIdentical(playerMovesArr, teacherMovesArr)) {
        textAlign(CENTER);
        fill(255)
        textSize(50);
        text('good.', canvasWidth / 2, canvasHeight / 2);
        textSize(25);
        text('ENTER to next level', canvasWidth / 2, canvasHeight - canvasHeight / 5);
    }
    else {
        textAlign(CENTER);
        fill(255, 0, 0);
        textSize(50);
        text('WRONG!', canvasWidth / 2, canvasHeight / 2);
        fill(255);
        textSize(25);
        text('You survived '+currentLevel+ ' lessons.', canvasWidth / 2, canvasHeight - canvasHeight / 5);
    }
}

function arraysAreIdentical(arr1, arr2) {
    if (arr1.length !== arr2.length) {
        return false;
    }
    for (let i = 0; i < arr1.length; i++) {
        if (arr1[i] !== arr2[i]) {
            return false;
        }
    }
    return true;
}