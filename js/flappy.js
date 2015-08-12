// the Game object used by the phaser.io library
var stateActions = {preload: preload, create: create, update: update};

var width = 790;
var height = 400;
var gameSpeed = 200;
var gameGravity = 200;
var jumpPower = 200;
var pipeInterval = 1.75;
var gapSize = 150;
var gapMargin = 50;
var blockHeight = 50;
var game = new Phaser.Game(width, height, Phaser.AUTO, 'game', stateActions);

/*
 * Loads all resources for the game and gives them names.
 *
 */
var score = -2;
var player;
var labelScore;
var pipes = [];
var lois = [];
var lex = [];
var waitingForEnter = false;

$.get("/score", function (scores) {
    //var scores = JSON.parse(data);
    scores.sort(function (scoreA, scoreB) {
        var difference = scoreB.score - scoreA.score;
        return difference;
    });
    for (var i = 0; i < scores.length; i++) {
        $("#scoreBoard").append("<li>" + scores[i].name + ": " +
        scores[i].score + "</li>");
    }
});
/*$.get("/score", function (scores) {
    console.log("Data: ", scores);
});*/

jQuery("#greeting-form").on("submit", function (event_details) {
    var greeting = "Hello ";
    var name = jQuery("#fullName").val();
    var greeting_message = greeting + name;
    jQuery("#greeting-form").hide();
    jQuery("#greeting").append("<p>" + greeting_message + " (" +
    jQuery("#email").val() + "): " + jQuery("#score").val() + "</p>");
    jQuery("#greeting").fadeOut(6 * 1000);
    //game.paused = false;
    //event_details.preventDefault();
});


function preload() {
    game.load.image("playerImg", "../assets/flappy_superman.png");
    game.load.image("pipe", "../assets/skyscraper2.png");
    game.load.image("backgroundImg", "../assets/newyork.jpg");
    game.load.image("powerUp", "../assets/loislane2.jpg");
    game.load.image("powerDown", "../assets/lexluther2.jpg");
}

/*
 * Initialises the game. This function is only called once.
 */
function create() {

    game.add.image(0, 0, "backgroundImg")

    var t = game.add.text(250, 150, "Good Luck!", {font: "50px Verdana", fill: "#00008A"});
    // set the background colour of the scene

    game.input
        .onDown
        .add(clickHandler);

    //   game.input
    //     .keyboard.addKey(Phaser.Keyboard.SPACEBAR)
    //     .onDown.add(spaceHandler);
    //alert(score);

    labelScore = game.add.text(20, 20, "0", {font: "30px Arial", fill: "#FFFFFF"});

    player = game.add.sprite(100, 200, "playerImg");

    player.anchor.setTo(0, 0);

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
    player.body.gravity.y = gameGravity;

    game.input.keyboard
        .addKey(Phaser.Keyboard.SPACEBAR)
        .onDown.add(playerJump);

    game.time.events
        .loop(pipeInterval * Phaser.Timer.SECOND,
        generatePipe);

    game.paused = true;

    game.input.keyboard.addKey(Phaser.Keyboard.ENTER)
        .onDown.add(gamestart);


    if (isEmpty(fullName)) {
        response.send("Please make sure you enter your name.");
    }

}


function gamestart() {

    game.paused = false;
}

function generate() {
    var diceRoll = game.rnd.integerInRange(1, 10);
    if (diceRoll == 1) {
        generateLex();

    } else if (diceRoll == 2) {
        generateLois();

    } else {
        generatePipe();
    }
}

function clickHandler(event) {
    alert("Game Paused");
}
/*

 * This function updates the scene. It is called for every new frame.
 */
function update() {
    diesuperman();
    game.physics.arcade.overlap(player, pipes, gameOver);
    player.rotation = Math.atan(player.body.velocity.y / gameSpeed);
}

function changeScore() {
    score = score + 1;
    labelScore.setText(score.toString(), {font: "30px Arial", fill: "#FFFFFF"});
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

    var gapStart = game.rnd.integerInRange(gapMargin, height - gapSize - gapMargin);

    for (var y = gapStart; y > 0; y -= blockHeight) {
        addPipeBlock(width, y - blockHeight);
    }
    for (var y = gapStart + gapSize; y < height; y += blockHeight) {
        addPipeBlock(width, y);
    }


    changeScore();

    //}
}
function addPipeBlock(x, y) {
    var pipeBlock = game.add.sprite(x, y, "pipe");
    pipeBlock.width = 50;
    pipeBlock.height = 50;
    pipes.push(pipeBlock);
    game.physics.arcade.enable(pipeBlock);
    pipeBlock.body.velocity.x = -gameSpeed;
}

function playerJump() {
    player.body.velocity.y = -jumpPower;

}

function gameOver() {
    //game.paused = true;

    $("#score").val(score);
    $("#greeting").show();
    $("greeting-form").show();
    score = -1;
    game.state.restart();

    //$("#greeting").hide();
}

function diesuperman() {
    if (player.y > 400 || player.y < 0) {
        gameOver();
    }
}

function isEmpty(str) {
    return (!str || 0 === str.length);
}
function generateLois() {
    var bonus = game.add.sprite(width, height, "powerUp");
    lois.push(bonus);
    game.physics.arcade.enable(bonus);
    bonus.body.velocity.x = -200;
    bonus.body.velocity.y = -game.rnd.integerInRange(60, 100);
}

function generateLex() {
    var bonus = game.add.sprite(width, 0, "powerDown");
    lex.push(bonus);
    game.physics.arcade.enable(bonus);
    bonus.body.velocity.x = -200;
    bonus.body.velocity.y = game.rnd.integerInRange(60, 100);
}


function changeGravity(g) {
    gameGravity += g;
    player.body.gravity.y = gameGravity;
}


















