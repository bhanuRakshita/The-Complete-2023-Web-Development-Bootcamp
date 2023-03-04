
var buttonColours= ["red","blue","green","yellow"];
var gamePattern=[];
var userClickedPattern=[];
var gameStarted = false;
var level = 0;

//check keyboard clicks
$(document).on("keypress", (function() {
    console.log("key was pressedddd");

    if(!gameStarted) {
        gameStarted=true;
        //$("#level-title").text("Level " + level);
        nextSequence();
    }
    
}));

function nextSequence() {
    userClickedPattern = [];
    console.log("calling nextSequence");
    var randomNumber = Math.floor(Math.random()*4);     
    var randomChosenColour = buttonColours[randomNumber]; 
    gamePattern.push(randomChosenColour);

    //animate the randomly selected colour
    $("#"+randomChosenColour).fadeOut(100).fadeIn(100).fadeOut(100).fadeIn(100);

    //sound and animation for randomly selected colour
    playSound(randomChosenColour);

    
}

//Check the buttons clicked
$(".btn").on("click", function(event) {
    var userChosenColour = this.id;
    userClickedPattern.push(userChosenColour);

    //sound and animation for colour selected by user
    playSound(userChosenColour);
    animatePress(userChosenColour);

    console.log("game pattern is " + gamePattern);
    console.log("user clicked pattern is " + userClickedPattern);

    checkAnswer(userClickedPattern.length-1);

});



function playSound(name) {
    var audioLink= "sounds/" + name + ".mp3";
    var audio = new Audio(audioLink);
    audio.play();
}

function animatePress(currentColour) {

    console.log("animation on colour" + currentColour);
    $("#" + currentColour).addClass("pressed");
    setTimeout(() => {$("#" + currentColour).removeClass("pressed");
    }, 100);
    
}

function checkAnswer(currentLevel) { 
    $("h1").text("Level " + currentLevel);
    if(userClickedPattern[currentLevel] === gamePattern[currentLevel]) {
        console.log("success");

        if (userClickedPattern.length === gamePattern.length){
            level++;
            setTimeout(function () {
            nextSequence();
            }, 1000);

            level++;
            $("h1").text("Level " + level);
    
          }
    }

    else{
        console.log("wrong");
        var wrongAudio = new Audio("sounds/wrong.mp3");
        wrongAudio.play();
        $("body").addClass("game-over");
        setTimeout(function() {
            $("body").removeClass("game-over");
        }, 1000);

        $("h1").text("Game Over, Presss any key to Restart");
        startOver();
    }
 
}

function startOver() {
    level=0;
    gamePattern=[];
    gameStarted=false;
    userClickedPattern=[];
}



