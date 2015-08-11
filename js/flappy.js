// the Game object used by the phaser.io library
var stateActions = { preload: preload, create: create, update: update };

// Phaser parameters:
// - game width
// - game height
// - renderer (go for Phaser.AUTO)
// - element where the game will be drawn ('game')
// - actions on the game state (or null for nothing)
var game = new Phaser.Game(790, 400, Phaser.AUTO, 'game', stateActions);

/*
 * Loads all resources for the game and gives them names.
 *
 */
var score = 0;
var player;
var labelScore;
var pipes = [];
function preload() {
    game.load.image("playerImg", "../assets/flappy_superman.png");
    game.load.image("pipe","../assets/pipe_pink.png");
}
function spaceHandler() {
 game.sound.play("score");
 }
 /*
 * Initialises the game. This function is only called once.
 */
function create() {
    game.stage.setBackgroundColor("#CEDAE6");
    var t=game.add.text(250, 150, "Good Luck!", {font: "50px Verdana", fill: "#00008A"});
    // set the background colour of the scene
    game.add.sprite(10, 350, "playerImg");
    game.add.sprite(730, 350, "playerImg");
    game.add.sprite(730, 10, "playerImg");
    game.input
        .onDown
        .add(clickHandler);
    game.input
        .keyboard.addKey(Phaser.Keyboard.SPACEBAR)
        .onDown.add(spaceHandler);
    //alert(score);
    labelScore = game.add.text(20, 20, "0");
    player = game.add.sprite(100, 200, "playerImg");
    game.input.keyboard.addKey(Phaser.Keyboard.RIGHT)
        .onDown.add(moveRight);
    game.input.keyboard.addKey(Phaser.Keyboard.LEFT)
        .onDown.add(moveLeft);
    game.input.keyboard.addKey(Phaser.Keyboard.UP)
        .onDown.add(moveUp);
    game.input.keyboard.addKey(Phaser.Keyboard.DOWN)
        .onDown.add(moveDown);
    generatePipe();
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.enable(player);
    player.body.velocity.x = 0;
    player.body.velocity.y = -80;
    player.body.gravity.y = 175;
    game.input.keyboard
        .addKey(Phaser.Keyboard.SPACEBAR)
        .onDown.add(playerJump);
    var pipeInterval = 1;
    game.time.events
        .loop(pipeInterval * Phaser.Timer.SECOND,
    generatePipe);

    game.paused = true;
    game.input.keyboard.addKey(Phaser.Keyboard.ENTER)
    game.start = true;

}

function clickHandler(event) {
    alert("The position is: " + event.x + "," + event.y);
    game.add.sprite(event.x, event.y, "playerImg");
}
/*
 * This function updates the scene. It is called for every new frame.
 */
function update() {
    diesuperman();
    game.physics.arcade
    .overlap(player,
    pipes,
    gameOver);
}


function diesuperman () {
    if (player.y > 400 || player.y < 0){gameOver();}

}
function changeScore() {
    score = score + 1;
    labelScore.setText(score.toString());
}
function moveLeft() {
    player.x = player.x - 50
}
function moveRight() {
    player.x = player.x + 50
}
function moveUp() {
    player.y = player.y - 50
}
function moveDown() {
    player.y = player.y + 50
}
function generatePipe() {

    //for (var pipeNumber = 0; pipeNumber < 16; pipeNumber = pipeNumber + 4) {
        //if (count != gapStart && count != gapStart + 1) {
        //    game.add.sprite(0, count * 50, 150, "pipe");
        //}

        var gapStart = game.rnd.integerInRange(0, 6);
        for (var count = 0; count < 8; count = count + 1) {
            if (count != gapStart && count != gapStart + 1 && count != gapStart + 2) {
                //game.add.sprite(pipeNumber * 50, count * 50, "pipe");
                addPipeBlock(750, count*50);
            }
        }

    changeScore();

    //}
}
function addPipeBlock(x, y) {
    var pipeBlock = game.add.sprite(x,y,"pipe");
    pipes.push(pipeBlock);
    game.physics.arcade.enable(pipeBlock);
    pipeBlock.body.velocity.x = -400;
}

function playerJump() {
    player.body.velocity.y = -150;

}

function gameOver() {
    ///game.destroy();
    score=0;
    game.state.restart();
}



























