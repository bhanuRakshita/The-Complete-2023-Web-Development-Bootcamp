var randomNumber1 = (Math.floor(Math.random()*6)+1);
randomDiceImage1= "images/dice"+randomNumber1+".png";

image1= document.querySelectorAll("img")[0];
image1.setAttribute("src",randomDiceImage1); 

var randomNumber2 = (Math.floor(Math.random()*6)+1);
randomDiceImage2= "images/dice"+randomNumber2+".png";

image2= document.querySelectorAll("img")[1];
image2.setAttribute("src",randomDiceImage2); 

winner= document.querySelector("h1");

if(randomNumber1==randomNumber2) {
    winner.innerHTML="DRAWWWWW";
}

else if(randomNumber1>randomNumber2) {
    winner.innerHTML="PLAYER 1 WINS";
}

else {
    winner.innerHTML="PLAYER 2 WINS";
}