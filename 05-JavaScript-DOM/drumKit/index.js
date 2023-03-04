var numberOfDrumButtons = document.querySelectorAll(".drum").length;

for(var i=0; i<numberOfDrumButtons; i++) {

    //When drum button is clicked on screen

    document.querySelectorAll(".drum")[i].addEventListener("click", function() {
        var button = this.innerHTML;
        makeSound(button);
        buttonAnimation(button);
    });
}



//When drum key is pressed on keyboard
document.addEventListener("keydown", function(event) {
    makeSound(event.key);
    buttonAnimation(event.key);
});

function makeSound(key) {

    switch (key) {
        case "w":
            var tom1 = new Audio("sounds/tom-1.mp3");
            tom1.play();            
            break;

        case "a":
            var tom2 = new Audio("sounds/tom-2.mp3");
            tom2.play();            
            break;

        case "s":
            var tom3 = new Audio("sounds/tom-3.mp3");
            tom3.play();            
            break;

        case "d":
            var tom4 = new Audio("sounds/tom-4.mp3");
            tom4.play();            
            break;

        case "j":
            var crash = new Audio("sounds/crash.mp3");
            crash.play();            
            break;

        case "k":
            var kick = new Audio("sounds/kick-bass.mp3");
            kick.play();            
            break;

        case "l":
            var snare = new Audio("sounds/snare.mp3");
            snare.play();            
            break;
            
        default:
            break;
    }
}

function buttonAnimation(pressedKey) {
    var pressedDrumKey = document.querySelector("."+pressedKey);
    pressedDrumKey.classList.add("pressed");

    setTimeout( function(){
        pressedDrumKey.classList.remove("pressed");
    }, 100);

}