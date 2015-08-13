// the Game object used by the phaser.io library
var actions = { preload: preload, create: create, update: update };

// Phaser parameters:
// - game width
// - game height
// - renderer (go for Phaser.AUTO)
// - element where the game will be drawn ('game')
// - actions on the game state (or null for nothing)
var width = 790;
var height = 400;
var gameSpeed = 200;
var gameGravity = 400;
var jumpPower = 200;
var pipeInterval = 1.75;
var gapSize = 150
var gapMargin = 50
var blockHeight = 50
var game = new Phaser.Game(width, height, Phaser.AUTO, "game", actions);


/*
 * Loads all resources for the game and gives them names.
 *
 */

var score = 0;
var player;
var labelScore;
var pipes = [];
var lois = [];
var lex = [];
var superBadge = [];
var waitingForEnter = true;
var splashDisplay = [];




jQuery("#greeting-form").on("submit", function(event_details) {
    var greeting = "Hello ";
    var name = jQuery("#fullName").val();
    var greeting_message = greeting + name;
    alert(greeting_message);
    event_details.preventDefault();
});
function preload() {
    game.load.image("playerImg", "../assets/flappy_superman.png");
    game.load.image("pipe","../assets/skyscraper2.png");
    game.load.image("backgroundImg", "../assets/newyork.jpg");
    game.load.image("powerUp", "../assets/loislane2.jpg");
    game.load.image("powerDown","../assets/lexluther2.jpg");
    game.load.image("point","../assets/supermanbadge2.png");

}
function spaceHandler() {
 game.sound.play("score");
 }
 /*
 * Initialises the game. This function is only called once.
 */
function create() {
    var bg = game.add.tileSprite(0, 0, width, height, "backgroundImg");
    bg.autoScroll(- gameSpeed / 15, 0);
    //game.add.image(0, 0, "backgroundImg");

    // set the background colour of the scene

    game.input.keyboard.addKey(Phaser.Keyboard.ENTER)
        .onDown.add(start);
    splashDisplay = game.add.text(220,180, "Good Luck! Press ENTER");
}

function generate() {
    var diceRoll = game.rnd.integerInRange(1, 10);
    if(diceRoll==1) {
        generateLex();

    } else if(diceRoll==2) {
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
    if(!waitingForEnter) {
        diesuperman();
        game.physics.arcade
            .overlap(player,
            pipes,
            gameOver);



        player.rotation = Math.atan(player.body.velocity.y / gameSpeed);

        checkBonus("lois", lois, -50);
        checkBonus("lex", lex, 50);

        for(var n = superBadge.length - 1; n>=0; n--){
            if(game.physics.arcade.overlap(player, superBadge[n])){
                changeScore();
                superBadge[n].destroy();
                superBadge.splice(n, 1);
            }
        }

        //game.physics.arcade
        //    .overlap(player,
        //    pipes,
        //    function() { gapSize += 30
        //    });


    }
}

function checkBonus(bonusName, bonusArray, bonusEffect){
    for(var i=bonusArray.length - 1; i>=0; i--){
        game.physics.arcade.overlap(player,bonusArray[i], function() {
            changeGravity(bonusEffect);
            bonusArray[i].destroy();
            bonusArray.splice(i, 1);
            if (bonusName == "lex")
            {gapSize -= 30;
            }
            if (bonusName == "lois")
            {gapSize += 30;
            }
        });
    }

}


function diesuperman () {
    if (player.y > 400 || player.y < 0){gameOver();}

}
function changeScore() {
    score = score + 1;
    labelScore.setText(score.toString());
}
function moveUp() {
    player.y = player.y - 50
}
function moveDown() {
    player.y = player.y + 50
}
function generatePipe() {

        var gapStart = game.rnd.integerInRange(gapMargin, height - gapSize - gapMargin);

    gameSpeed += 50;
    pipeInterval -= 0.05;

        for(var y=gapStart; y > 0 ; y -= blockHeight) {
            addPipeBlock(width, y - blockHeight);
        }
           for(var y = gapStart + gapSize; y < height; y += blockHeight) {
               addPipeBlock(width, y);
           }


    addBadge(width, gapStart + 56);

    //}
}
function addPipeBlock(x, y) {
    var pipeBlock = game.add.sprite(x,y,"pipe");
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
    game.destroy();
    location.reload();
    $("#greeting") . show();
    gameGravity = 200;
    superBadge = [];
}

function changeGravity(g) {
    gameGravity += g;
    player.body.gravity.y = gameGravity;
}
function generateLois() {
    var bonus = game.add.sprite(width, height, "powerUp");
    lois.push(bonus);
    game.physics.arcade.enable(bonus);
    bonus.body.velocity.x = -200;
    bonus.body.velocity.y = - game.rnd.integerInRange(60, 100);

}

function generateLex() {
    var bonus = game.add.sprite(width, 0, "powerDown");
    lex.push(bonus);
    game.physics.arcade.enable(bonus);
    bonus.body.velocity.x = - 200;
    bonus.body.velocity.y = game.rnd.integerInRange(60,100);

}

function start() {
    waitingForEnter = false;
    game.input
        .onDown
        .add(clickHandler);

    game.input
        .keyboard.addKey(Phaser.Keyboard.SPACEBAR)
        .onDown.add(spaceHandler);
    //alert(score);
    labelScore = game.add.text(20, 20, "0");
    player = game.add.sprite(100, 200, "playerImg");
    player.anchor.setTo(0, 0);
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
        generate);
    game.input.keyboard.addKey(Phaser.Keyboard.ENTER).onDown.remove(start);
    splashDisplay.destroy();
}

function addBadge(x, y) {
    console.log("adding badge")
    Badge = game.add.sprite(x, y, "point");
    superBadge.push(Badge);
    game.physics.arcade.enable(Badge);
    Badge.body.velocity.x = -gameSpeed;
}














