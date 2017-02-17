// Create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 480;
document.body.appendChild(canvas);

// Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
	bgReady = true;
};
bgImage.src = "images/background.png";

// Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
	heroReady = true;
};
heroImage.src = "images/hero.png";

// Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
	monsterReady = true;
};
monsterImage.src = "images/monster.png";

// Game objects
var hero = {
	speed: 256 // movement in pixels per second
};
var monster = {};
var monstersCaught = 0;

// Handle keyboard controls
var keysDown = {};

addEventListener("keydown", function (e) {
	keysDown[e.keyCode] = true;
}, false);

addEventListener("keyup", function (e) {
	delete keysDown[e.keyCode];
}, false);

// Reset the game when the player catches a monster
var reset = function () {
	hero.x = canvas.width / 2;
	hero.y = canvas.height / 2;

	// Throw the monster somewhere on the screen randomly
	monster.x = 32 + (Math.random() * (canvas.width - 64));
	monster.y = 32 + (Math.random() * (canvas.height - 64));
};

// Update game objects
var update = function (modifier) {

	// monster automove
	// var dirction_m = Math.floor(time * 3.1415)% 4;
	// if(dirction_m==0 && monster.y>32){
	// 	monster.y -=hero.speed * modifier * Math.random();
	// }
	// if(dirction_m==1 && monster.y<(canvas.height - 64)){
	// 	monster.y +=hero.speed * modifier * Math.random();
	// }
	// if(dirction_m==2 && monster.x>32){
	// 	monster.x -=hero.speed * modifier * Math.random();
	// }
	// if(dirction_m==3 && monster.x<(canvas.width - 64)){
	// 	monster.x +=hero.speed * modifier * Math.random();
	// }

	if (38 in keysDown && hero.y>32) { // Player holding up
		hero.y -= hero.speed * modifier;
	}
	if (40 in keysDown && hero.y<(canvas.height - 64)) { // Player holding down
		hero.y += hero.speed * modifier;
	}
	if (37 in keysDown && hero.x>32) { // Player holding left
		hero.x -= hero.speed * modifier;
	}
	if (39 in keysDown && hero.x<(canvas.width - 64)) { // Player holding right
		hero.x += hero.speed * modifier;
	}
	// Are they touching?
	if (
		hero.x <= (monster.x + 32)
		&& monster.x <= (hero.x + 32)
		&& hero.y <= (monster.y + 32)
		&& monster.y <= (hero.y + 32)
		) {
		++monstersCaught;
	reset();
}
};

// Draw everything
var render = function () {
	if (bgReady) {
		ctx.drawImage(bgImage, 0, 0);
	}

	if (heroReady) {
		ctx.drawImage(heroImage, hero.x, hero.y);
	}

	if (monsterReady) {
		ctx.drawImage(monsterImage, monster.x, monster.y);
	}

	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "24px Helvetica";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Time:" + time, 32, 32);
	ctx.fillText("Goblins caught: " + monstersCaught, 32, 64);
};

// The main game loop
var main = function () {
	var now = Date.now();
	var delta = now - then;
	time = Math.floor((now - start)/ 1000);
	update(delta / 1000);
	render();

	then = now;

	// Request to do this again ASAP
	requestAnimationFrame(main);
};
// Time Check
var time_check =function(){
}


// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game!
var start = then = Date.now();
var time= 0;

reset();
main();